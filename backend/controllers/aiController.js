// External dependencies
const axios = require('axios');
const ChatModel = require('../models/chatModel');

// Hugging Face Space API base URL
const HF_SPACE_BASE_URL = process.env.HF_SPACE_BASE_URL;

/**
 * Maps customization options to specific AI instructions
 * @param {string} optionParam
 * @returns {string} AI instruction string
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

// Sends a recipe and customization instruction to Hugging Face for rewriting
exports.customizeRecipe = async (req, res) => {
  const { originalRecipe, customizationOption } = req.body;

  if (!originalRecipe || !customizationOption) {
    return res.status(400).json({ message: "Original recipe and customization option are required." });
  }

  const userInstruction = mapCustomizationOptionToInstruction(customizationOption);
  const rewriteEndpointUrl = `${HF_SPACE_BASE_URL}/rewrite/`;

  try {
    const payload = { recipe: originalRecipe, user_instruction: userInstruction };
    const response = await axios.post(rewriteEndpointUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 90000,
    });

    const hfData = response.data;

    if (hfData && Array.isArray(hfData.rewritten_recipe)) {
      const formattedCustomizedRecipe = hfData.rewritten_recipe
        .map((step, index) => `${index + 1}. ${step.trim()}`)
        .join('\n');

      return res.status(200).json({ customizedRecipe: formattedCustomizedRecipe });
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

// Handles user message, sends it to the AI, saves conversation to DB
exports.handleChat = async (req, res) => {
  const { message, history } = req.body;
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ error: 'Authentication required or invalid user.' });
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

    if (typeof assistantReply !== 'string' || assistantReply.trim() === '') {
      return res.status(500).json({ error: 'AI service returned an invalid or empty response.' });
    }

    await ChatModel.saveChatMessage(userId, assistantReply, 'assistant');
    const updatedHistoryFromDb = await ChatModel.getChatHistory(userId);
    res.status(200).json({ reply: assistantReply, history: updatedHistoryFromDb });

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.detail || `AI service error: ${error.response.status}`,
        details: error.response.data,
      });
    } else if (error.request) {
      return res.status(504).json({ error: "AI service is unreachable or timed out." });
    } else {
      return res.status(500).json({ error: `Internal server error: ${error.message}`, details: error });
    }
  }
};

// Retrieves chat history for the authenticated user
exports.getChatHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await ChatModel.getChatHistory(userId);
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chat history.', details: error.message });
  }
};
