import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Food from "../models/food.model";
import FoodData from "../types/data/foodData.type";

const retrieveFoodData: () => Promise<FoodData[]> = async () => {
  const foodRepo = AppDataSource.getRepository(Food);
  try {
    const foods: FoodData[] = await foodRepo
      .createQueryBuilder("food")
      .innerJoin("food.typeId", "food_type")
      .select([
        "food.id AS food_id",
        "food.name AS food_name",
        "food.rarity AS rarity",
        "food_type.name AS food_type",
        "food.specialDish AS special_dish",
        "food.purchasable AS purchasable",
        "food.recipe AS recipe",
        "food.event AS event",
        "food.imageUrl AS food_image_url",
      ])
      .orderBy({ food_id: "ASC" })
      .getRawMany();
    return foods;
  } catch (err) {
    throw new Error("There was an error querying foods.");
  }
};

const getFoods: RequestHandler = async (req, res, next) => {
  const foodData = await retrieveFoodData();
  res.send(foodData);
};

export { getFoods, retrieveFoodData };
