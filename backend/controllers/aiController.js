const axios = require('axios');
const ShoppingListModel = require('../models/shoppingListModel');
const redisClient = require('../utils/redisClient'); 
const HF_SPACE_BASE_URL = process.env.HF_SPACE_BASE_URL;

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

// Made caching resilient to Redis failures
const safeSetCache = async (key, value, expireTime) => {
    try {
        await redisClient.set(key, value, 'EX', expireTime);
    } catch (err) {
        console.error('Failed to set cache for key:', key, err);
    }
};

exports.customizeRecipe = async (req, res) => {
    const { originalRecipe, customizationOption } = req.body;
    const cacheKey = `custom_recipe:${customizationOption}:${originalRecipe}`;

    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        console.log('Serving customized recipe from Redis cache.');
        return res.status(200).json(JSON.parse(cachedResult));
    }

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
            const responseData = { customizedRecipe: formattedRecipe };

            await safeSetCache(cacheKey, JSON.stringify(responseData), 3600);
            return res.status(200).json(responseData);
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

exports.handleChat = async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ error: 'Authentication required.' });
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const cacheKey = `chat:${userId}:${message}`;
    const cachedResult = await redisClient.get(cacheKey);

    if (cachedResult) {
        console.log('Serving chat response from Redis cache.');
        return res.status(200).json(JSON.parse(cachedResult));
    }

    try {
        const chatEndpointUrl = `${HF_SPACE_BASE_URL}/chat/`;

        const hfResponse = await axios.post(
            chatEndpointUrl,
            { message },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 90000,
            }
        );

        const assistantReply = hfResponse.data.reply;

        if (!assistantReply || typeof assistantReply !== 'string') {
            return res.status(500).json({ error: 'AI service returned an invalid or empty response.' });
        }

        const responseData = { reply: assistantReply };
        await safeSetCache(cacheKey, JSON.stringify(responseData), 3600);
        res.status(200).json(responseData);

    } catch (error) {
        console.error("Error in handleChat:", error);
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

exports.generateShoppingList = async (req, res) => {
    const { dishNames } = req.body;
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ error: 'Authentication required.' });
    if (!Array.isArray(dishNames) || dishNames.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of dish names.' });
    }
    // Sort dish names to ensure consistent cache keys 
    const specificCacheKey = `shopping_list:${userId}:${JSON.stringify(dishNames.sort())}`;
    const latestListCacheKey = `latest_shopping_list:${userId}`;

    // Check if the specific list is already in the cache
    const cachedResult = await redisClient.get(specificCacheKey);
    if (cachedResult) {
        console.log('Serving shopping list from Redis cache.');
        return res.status(200).json(JSON.parse(cachedResult));
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
            return res.status(500).json({ error: 'AI service returned an invalid or empty response.' });
        }
        
        const listToSave = {
            content: generatedList,
            dishes: dishNames,
        };

        const savedList = await ShoppingListModel.saveShoppingList(userId, listToSave);
        const responseData = { shoppingList: generatedList, savedListId: savedList.id };

        // Cache the specific list for future identical requests
        await safeSetCache(specificCacheKey, JSON.stringify(responseData), 3600);
        
        // Also update the 'latest list' cache key for immediate retrieval
        await safeSetCache(
            latestListCacheKey,
            JSON.stringify({ 
                shoppingList: savedList.items,
                generatedAt: savedList.generated_at.toISOString() 
            }),
            3600
        );

        res.status(200).json(responseData);

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

exports.getShoppingList = async (req, res) => {
    const userId = req.user.id;
    const cacheKey = `latest_shopping_list:${userId}`; 

    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        console.log('Serving latest shopping list from Redis cache.');
        return res.status(200).json(JSON.parse(cachedResult));
    }

    if (!userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const latestList = await ShoppingListModel.getLatestShoppingList(userId);
        if (!latestList) {
            return res.status(404).json({ message: 'No shopping list found for this user.' });
        }

        const responseData = {
            shoppingList: latestList.items,
            generatedAt: latestList.generated_at,
        };
        
        await safeSetCache(cacheKey, JSON.stringify(responseData), 3600);

        res.status(200).json(responseData);

    } catch (error) {
        res.status(500).json({ error: 'Failed to load shopping list.', details: error.message });
    }
};