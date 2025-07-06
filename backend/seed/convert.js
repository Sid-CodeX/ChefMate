const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const pool = require("../config/db");

const filePath = path.join(__dirname, "../data/recipes.csv");


/**
 * Reads recipes from a CSV file and inserts them into the PostgreSQL database.
 */

async function seedRecipes() {
  const recipes = [];

  // Read and parse CSV data into an array of recipe objects
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      recipes.push(row);
    })
    .on("end", async () => {
      console.log(`📦 Read ${recipes.length} recipes from CSV.`);

      // Insert each recipe into the database
      for (const recipe of recipes) {
        try {
          // Destructure recipe fields from CSV row
          const {
            name,
            ingredients,
            diet,
            prep_time,
            cook_time,
            total_time,
            difficulty,
            flavor_profile,
            course,
            state,
            region,
            image_url,
            instruction,
          } = recipe;

          // Execute parameterized SQL query to insert recipe data
          await pool.query(
            `INSERT INTO recipes 
              (name, ingredients, diet, prep_time, cook_time, total_time, difficulty, flavor_profile, course, state, region, image_url, instruction)
             VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              name,
              ingredients,
              diet,
              parseInt(prep_time) || null,
              parseInt(cook_time) || null,
              parseInt(total_time) || null,
              difficulty,
              flavor_profile,
              course,
              state,
              region,
              image_url,
              instruction,
            ]
          );
        } catch (err) {
          console.error(`Error inserting recipe "${recipe.name}":`, err.message);
        }
      }

      console.log("All recipes inserted successfully!");
      process.exit();
    });
}

seedRecipes();
