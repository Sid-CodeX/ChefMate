// External dependencies
const axios = require('axios');
const ChatModel = require('../models/chatModel');
const ShoppingListModel = require('../models/shoppingListModel');

// Environment variable: Hugging Face Space base URL
const HF_SPACE_BASE_URL = process.env.HF_SPACE_BASE_URL;

/**
 * Maps customization options to AI-friendly instructions.
 * @param {string} optionParam - Customization option.
 * @returns {string} Instruction string for the AI.
 */
const mapCustomizationOptionToInstruction = (optionParam) => {
  switch (optionParam) {
    case 'vegan':
      return "Rewrite this recipe to be completely vegan using plant-based alternatives.";
    case 'low-calorie':
      return "Rewrite this recipe to reduce calories with lighter ingredients and healthy methods.";
    case 'quick':
      return "Simplify and shorten the recipe for quick preparation with minimal steps.";
    case 'gluten-free':
      return "Replace gluten-containing ingredients with gluten-free alternatives.";
    case 'high-protein':
      return "Adjust the recipe to boost protein content using high-protein ingredients.";
    case 'kid-friendly':
    case 'general':
      return "Improve clarity, formatting, and ease of understanding for home cooks.";
    default:
      return "Rewrite this recipe to improve readability and coherence.";
  }
};

/**
 * POST /customize-recipe
 * Sends recipe and instruction to Hugging Face and returns the customized result.
 */
exports.customizeRecipe = async (req, res) => {
  const { originalRecipe, customizationOption } = req.body;

  if (!originalRecipe || !customizationOption) {
    return res.status(400).json({ message: "Original recipe and customization option are required." });
  }

  const userInstruction = mapCustomizationOptionToInstruction(customizationOption);
  const rewriteEndpointUrl = `${HF_SPACE_BASE_URL}/rewrite/`;

  try {
    const response = await axios.post(
      rewriteEndpointUrl,
      { recipe: originalRecipe, user_instruction: userInstruction },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000,
      }
    );

    const hfData = response.data;

    if (hfData && Array.isArray(hfData.rewritten_recipe)) {
      const formattedRecipe = hfData.rewritten_recipe
        .map((step, idx) => `${idx + 1}. ${step.trim()}`)
        .join('\n');

      return res.status(200).json({ customizedRecipe: formattedRecipe });
    }

    return res.status(500).json({ message: "Unexpected response from AI service. Please check Hugging Face logs." });

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.detail || `AI service error: ${error.response.status}`,
      });
    } else if (error.request) {
      return res.status(504).json({ message: "AI service is unreachable or timed out." });
    } else {
      return res.status(500).json({ message: `Request setup failed: ${error.message}` });
    }
  }
};

/**
 * POST /chat
 * Handles a user message, sends it to Hugging Face, saves to DB, and returns the response.
 */
exports.handleChat = async (req, res) => {
  const { message, history } = req.body;
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ error: 'Authentication required.' });
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  try {
    await ChatModel.saveChatMessage(userId, message, 'user');

    const chatEndpointUrl = `${HF_SPACE_BASE_URL}/chat/`;
    const hfResponse = await axios.post(
      chatEndpointUrl,
      { history, message },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000,
      }
    );

    const assistantReply = hfResponse.data.reply;

    if (!assistantReply || typeof assistantReply !== 'string') {
      return res.status(500).json({ error: 'AI service returned an invalid or empty response.' });
    }

    await ChatModel.saveChatMessage(userId, assistantReply, 'assistant');
    const updatedHistory = await ChatModel.getChatHistory(userId);

    res.status(200).json({ reply: assistantReply, history: updatedHistory });

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.detail || `AI service error: ${error.response.status}`,
        details: error.response.data,
      });
    } else if (error.request) {
      return res.status(504).json({ error: "AI service is unreachable or timed out." });
    } else {
      return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  }
};

/**
 * GET /chat-history
 * Retrieves the authenticated user's chat history.
 */
exports.getChatHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await ChatModel.getChatHistory(userId);
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chat history.', details: error.message });
  }
};

/**
 * POST /generate-shopping-list
 * Generates a shopping list based on dish names via AI and saves it.
 */
exports.generateShoppingList = async (req, res) => {
  const { dishNames } = req.body;
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ error: 'Authentication required.' });
  if (!Array.isArray(dishNames) || dishNames.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of dish names.' });
  }

  const shoppingEndpointUrl = `${HF_SPACE_BASE_URL}/shopping/`;

  try {
    const hfResponse = await axios.post(
      shoppingEndpointUrl,
      { dishes: dishNames },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      }
    );

    const generatedList = hfResponse.data.shopping_list;

    if (!generatedList || typeof generatedList !== 'string') {
      return res.status(500).json({ error: 'AI service returned an invalid or empty shopping list.' });
    }

    const savedList = await ShoppingListModel.saveShoppingList(userId, generatedList);
    res.status(200).json({ shoppingList: generatedList, savedListId: savedList.id });

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data.detail || `AI service error: ${error.response.status}`,
        details: error.response.data,
      });
    } else if (error.request) {
      res.status(504).json({ error: "AI shopping list service is unreachable or timed out." });
    } else {
      res.status(500).json({ error: `Request setup failed: ${error.message}` });
    }
  }
};

/**
 * GET /shopping-list
 * Retrieves the latest shopping list generated for the authenticated user.
 */
exports.getShoppingList = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const latestList = await ShoppingListModel.getLatestShoppingList(userId);
    if (!latestList) {
      return res.status(404).json({ message: 'No shopping list found for this user.' });
    }

    res.status(200).json({
      shoppingList: latestList.items,
      generatedAt: latestList.generated_at,
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to load shopping list.', details: error.message });
  }
};
