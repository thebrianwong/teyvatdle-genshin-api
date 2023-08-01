import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Food from "../models/food.model";

const getFoods: RequestHandler = async (req, res, next) => {
  const foodRepo = AppDataSource.getRepository(Food);
  const foods = await foodRepo
    .createQueryBuilder("food")
    .innerJoin("food.typeId", "food_type")
    .select([
      "food.name AS food_name",
      "food.rarity AS rarity",
      "food_type.name AS food_type",
      "food.specialDish AS special_dish",
      "food.purchasable AS purchasable",
      "food.recipe AS recipe",
      "food.event AS event",
      "food.imageUrl AS food_image_url",
    ])
    .getRawMany();
  res.send(foods);
};

export { getFoods };
