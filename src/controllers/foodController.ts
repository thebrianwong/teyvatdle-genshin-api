import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Food from "../models/food.model";
// import FoodData from "../types/data/foodData.type";
import { FoodData } from "../generated/graphql";

const retrieveFoodData: () => Promise<FoodData[]> = async () => {
  const foodRepo = AppDataSource.getRepository(Food);
  try {
    const foods: FoodData[] = await foodRepo
      .createQueryBuilder("food")
      .innerJoin("food.typeId", "food_type")
      .select([
        'food.id AS "foodId"',
        'food.name AS "foodName"',
        "food.rarity AS rarity",
        'food_type.name AS "foodType"',
        'food.specialDish AS "specialDish"',
        "food.purchasable AS purchasable",
        "food.recipe AS recipe",
        "food.event AS event",
        'food.imageUrl AS "foodImageUrl"',
      ])
      .orderBy({ '"foodName"': "ASC" })
      .getRawMany();
    return foods;
  } catch (err) {
    throw new Error("There was an error querying foods.");
  }
};

const retrieveFilteredFoodData: (
  filterType: "id" | "foodName" | "foodType",
  searchValue: String
) => Promise<FoodData[]> = async (filterType, searchValue) => {
  const foodRepo = AppDataSource.getRepository(Food);
  try {
    const baseQuery = foodRepo
      .createQueryBuilder("food")
      .innerJoin("food.typeId", "food_type")
      .select([
        'food.id AS "foodId"',
        'food.name AS "foodName"',
        "food.rarity AS rarity",
        'food_type.name AS "foodType"',
        'food.specialDish AS "specialDish"',
        "food.purchasable AS purchasable",
        "food.recipe AS recipe",
        "food.event AS event",
        'food.imageUrl AS "foodImageUrl"',
      ]);
    if (filterType === "id") {
      baseQuery.where("food.id = :id", { id: Number(searchValue) });
    } else if (filterType === "foodName") {
      baseQuery.where("food.name = :foodName", {
        foodName: searchValue,
      });
    } else if (filterType === "foodType") {
      baseQuery.where("food_type.name = :foodType", {
        foodType: searchValue,
      });
    }
    const foods: FoodData[] = await baseQuery
      .orderBy({ '"foodId"': "ASC" })
      .getRawMany();
    return foods;
  } catch (err) {
    throw new Error("There was an error querying constellations.");
  }
};

const retrieveRandomFoodData: () => Promise<FoodData[]> = async () => {
  const foods = await retrieveFoodData();
  const randomIndex = Math.trunc(Math.random() * foods.length);
  const randomFood = foods[randomIndex];
  return [randomFood];
};

const getFoods: RequestHandler = async (req, res, next) => {
  const foodData = await retrieveFoodData();
  res.send(foodData);
};

export {
  getFoods,
  retrieveFoodData,
  retrieveFilteredFoodData,
  retrieveRandomFoodData,
};
