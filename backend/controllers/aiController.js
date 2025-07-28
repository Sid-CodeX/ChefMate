const axios = require('axios');

// Hugging Face Space FastAPI base URL 
const HF_SPACE_BASE_URL = process.env.HF_SPACE_BASE_URL;

/**
 * Maps a frontend customization keyword to a detailed instruction string.
 * These instructions are sent to the Hugging Face FastAPI backend.
 * @param {string} optionParam - The selected customization option
 * @returns {string} - Instruction to guide the AI model
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
      return "Make the recipe safe, simple, and appealing for children.";
    case 'general':
      return "Improve clarity, formatting, and ease of understanding for home cooks.";
    default:
      return "Rewrite this recipe to improve readability and coherence.";
  }
};

// Customizes a recipe using Hugging Face Space AI
exports.customizeRecipe = async (req, res) => {
  const { originalRecipe, customizationOption } = req.body;

  // Validate inputs
  if (!originalRecipe || !customizationOption) {
    return res.status(400).json({ message: "Original recipe and customization option are required." });
  }

  const userInstruction = mapCustomizationOptionToInstruction(customizationOption);
  const rewriteEndpointUrl = `${HF_SPACE_BASE_URL}/rewrite/`;

  try {
    // Request payload for FastAPI model
    const payload = {
      recipe: originalRecipe,
      user_instruction: userInstruction,
    };

    // Send request to Hugging Face Space
    const response = await axios.post(rewriteEndpointUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 90000, // 90s timeout
    });

    const hfData = response.data;

    // Format returned steps into numbered recipe string
    if (hfData && Array.isArray(hfData.rewritten_recipe)) {
      const formattedCustomizedRecipe = hfData.rewritten_recipe
        .map((step, index) => `${index + 1}. ${step.trim()}`)
        .join('\n');

      console.log("[AI] Recipe successfully customized.");
      return res.status(200).json({ customizedRecipe: formattedCustomizedRecipe });
    }

    // Handle unexpected response structure
    console.error("[AI] Unexpected response format:", hfData);
    return res.status(500).json({ message: "Unexpected response from AI service. Please check Hugging Face logs." });

  } catch (error) {
    // Log and handle Axios errors
    console.error("[AI] Error during AI request:", error.message);

    if (error.response) {
      console.error("Response Error:", error.response.data);
      return res.status(error.response.status).json({
        message: error.response.data.detail || `AI service error: ${error.response.status}`,
      });
    } else if (error.request) {
      console.error("No Response from AI:", error.request);
      return res.status(504).json({ message: "AI service is unreachable or timed out." });
    } else {
      console.error("Request Setup Error:", error.message);
      return res.status(500).json({ message: `Request setup failed: ${error.message}` });
    }
  }
};
