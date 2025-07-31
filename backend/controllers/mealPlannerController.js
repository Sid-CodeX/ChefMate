const WeeklyPlanModel = require('../models/weeklyPlanModel'); // New model
const ShoppingListModel = require('../models/shoppingListModel'); // Re-use from shopping list feature
const axios = require('axios'); // For calling Hugging Face
const HF_SPACE_BASE_URL = process.env.HF_SPACE_BASE_URL;

/**
 * Retrieves the weekly meal plan for the logged-in user.
 * @route GET /api/planner/weekly-plan
 * @access Protected
 */
exports.getWeeklyPlan = async (req, res) => {
    const userId = req.user.id; 

    if (!userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const plan = await WeeklyPlanModel.getWeeklyPlan(userId);
        res.status(200).json({ plan });
    } catch (error) {
        console.error("[MealPlanner] Error fetching weekly plan:", error.message);
        res.status(500).json({ error: 'Failed to load weekly plan.', details: error.message });
    }
};

/**
 * Generates a shopping list based on the user's current weekly plan.
 * @route POST /api/planner/generate-shopping-list
 * @access Protected
 */
exports.generateShoppingListFromPlan = async (req, res) => {
    const userId = req.user.id; // From auth middleware

    if (!userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        const plan = await WeeklyPlanModel.getWeeklyPlan(userId);
        if (plan.length === 0) {
            return res.status(400).json({ message: 'No meals planned to generate a list from.' });
        }

        // Extract unique dish names from the plan
        const dishNames = Array.from(new Set(plan.map(item => item.recipe_name))).filter(Boolean); // Filter out null/undefined
        
        if (dishNames.length === 0) {
            return res.status(400).json({ message: 'No valid dish names found in your plan to generate a list.' });
        }

        console.log(`[AI Shopping - Planner] Generating list for user ${userId} with dishes:`, dishNames);

        // Call Hugging Face Space for shopping list generation
        const shoppingEndpointUrl = `${HF_SPACE_BASE_URL}/shopping/`;
        const payload = {
            dishes: dishNames,
        };

        const hfResponse = await axios.post(shoppingEndpointUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 120000, 
        });

        const generatedList = hfResponse.data.shopping_list;

        if (typeof generatedList !== 'string' || generatedList.trim() === '') {
            console.error("[AI Shopping - Planner] Hugging Face response missing or empty 'shopping_list' field:", hfResponse.data);
            return res.status(500).json({ error: 'AI service returned an invalid or empty shopping list.' });
        }

        // Save the generated list to the database
        const savedList = await ShoppingListModel.saveShoppingList(userId, generatedList);
        console.log(`[AI Shopping - Planner] Shopping list saved to DB with ID: ${savedList.id}`);

        res.status(200).json({ shoppingList: generatedList, savedListId: savedList.id });

    } catch (error) {
        console.error('[AI Shopping - Planner] Error during shopping list generation from plan:', error.message);
        if (error.response) {
            console.error('  Response Error Status:', error.response.status);
            console.error('  Response Error Data:', error.response.data);
            res.status(error.response.status).json({
                error: error.response.data.detail || `AI service error: ${error.response.status}`,
                details: error.response.data,
            });
        } else if (error.request) {
            console.error('  No Response from AI:', error.request);
            res.status(504).json({ error: "AI shopping list service is unreachable or timed out." });
        } else {
            console.error('  General Error:', error.message);
            res.status(500).json({ error: `Internal server error: ${error.message}` });
        }
    }
};

// You might also add an endpoint to add/update a meal plan entry
// exports.addMealPlanEntry = async (req, res) => { /* ... */ };