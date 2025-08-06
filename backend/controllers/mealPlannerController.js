const WeeklyPlanModel = require('../models/weeklyPlanModel');
const ShoppingListModel = require('../models/shoppingListModel');
const axios = require('axios');
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
        const dishNames = Array.from(new Set(plan.map(item => item.recipe_name))).filter(Boolean);
        
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
            console.error('   Response Error Status:', error.response.status);
            console.error('   Response Error Data:', error.response.data);
            res.status(error.response.status).json({
                error: error.response.data.detail || `AI service error: ${error.response.status}`,
                details: error.response.data,
            });
        } else if (error.request) {
            console.error('   No Response from AI:', error.request);
            res.status(504).json({ error: "AI shopping list service is unreachable or timed out." });
        } else {
            console.error('   General Error:', error.message);
            res.status(500).json({ error: `Internal server error: ${error.message}` });
        }
    }
};

/**
 * Saves or updates a meal plan entry for the logged-in user.
 * @route POST /api/planner/weekly-plan/meal
 * @access Protected
 */
exports.saveMealToPlan = async (req, res) => {
    const userId = req.user.id;
    const { day_of_week, meal_slot, recipe_id } = req.body;
  
    if (!day_of_week || !meal_slot || !recipe_id) {
        return res.status(400).json({ error: 'Day, meal slot, and recipe ID are required.' });
    }
  
    try {
        const result = await WeeklyPlanModel.saveMealPlanEntry(userId, day_of_week, meal_slot, recipe_id);
        const plan = await WeeklyPlanModel.getWeeklyPlan(userId);
        res.status(200).json({ message: 'Meal plan entry saved.', plan });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save meal plan entry.', details: error.message });
    }
};

/**
 * Deletes a meal plan entry for the logged-in user.
 * @route DELETE /api/planner/weekly-plan/meal
 * @access Protected
 */
exports.deleteMealFromPlan = async (req, res) => {
    const userId = req.user.id;
    const { day_of_week, meal_slot } = req.body;

    if (!day_of_week || !meal_slot) {
        return res.status(400).json({ error: 'Day and meal slot are required.' });
    }

    try {
        await WeeklyPlanModel.deleteMealPlanEntry(userId, day_of_week, meal_slot);
        const plan = await WeeklyPlanModel.getWeeklyPlan(userId);
        res.status(200).json({ message: 'Meal plan entry deleted.', plan });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete meal plan entry.', details: error.message });
    }
};