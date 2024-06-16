import { AppDataSource } from "../index";
import Food from "../models/food.model";
import { FoodData, FoodType } from "../generated/graphql";
import {
  foodByIdKey,
  foodNameToIdKey,
  foodsByTypeKey,
  foodsKey,
  formatAsKey,
} from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";
import { redisClient } from "../redis/redis";

const retrieveFoodData: () => Promise<FoodData[]> = async () => {
  try {
    const cachedFoods = await redisClient
      .call("JSON.GET", foodsKey())
      .then((data) => JSON.parse(data as string));
    if (cachedFoods) {
      return cachedFoods as FoodData[];
    } else {
      const foodRepo = AppDataSource.getRepository(Food);
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
      redisClient
        .pipeline()
        .call("JSON.SET", foodsKey(), "$", JSON.stringify(foods))
        .expireat(foodsKey(), expireKeyTomorrow(), "NX")
        .exec();
      return foods;
    }
  } catch (err) {
    throw new Error("There was an error querying foods. " + err);
  }
};

const retrieveFilteredFoodData: (
  filterType: "id" | "foodName" | "foodType",
  searchValue: string | FoodType
) => Promise<FoodData[]> = async (filterType, searchValue) => {
  try {
    let foodCacheKey: string | null = searchValue;
    if (filterType === "foodName") {
      foodCacheKey = await redisClient.hget(foodNameToIdKey(), searchValue);
    }

    let foodCacheKeyExists;
    if (foodCacheKey) {
      if (filterType === "foodType") {
        foodCacheKeyExists = await redisClient.call(
          "JSON.TYPE",
          foodsByTypeKey(),
          // foodType keys have to be formatted due to containing apostrophes and white space
          formatAsKey(foodCacheKey)
        );
      } else {
        foodCacheKeyExists = await redisClient.call(
          "JSON.TYPE",
          foodByIdKey(),
          foodCacheKey
        );
      }
    }

    if (foodCacheKey && foodCacheKeyExists) {
      if (filterType === "foodType") {
        const foods = (await redisClient
          .call("JSON.GET", foodsByTypeKey(), formatAsKey(foodCacheKey))
          .then((data) => JSON.parse(data as string))) as FoodData[];
        return foods;
      } else {
        const foods = (await redisClient
          .call("JSON.GET", foodByIdKey(), formatAsKey(foodCacheKey))
          .then((data) => JSON.parse(data as string))) as FoodData[];
        return foods;
      }
    } else {
      const foodRepo = AppDataSource.getRepository(Food);
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
      if (foods.length > 0) {
        if (foods.length === 1) {
          // id or name
          const foodId = foods[0].foodId!.toString();
          const foodName = foods[0].foodName!;
          redisClient
            .pipeline()
            .call("JSON.SET", foodByIdKey(), "$", JSON.stringify({}), "NX")
            .call(
              "JSON.SET",
              foodByIdKey(),
              foodId,
              JSON.stringify(foods),
              "NX"
            )
            .expireat(foodByIdKey(), expireKeyTomorrow(), "NX")
            .hset(foodNameToIdKey(), foodName, foodId)
            .expireat(foodNameToIdKey(), expireKeyTomorrow(), "NX")
            .exec();
        } else {
          // food type search
          const foodType = foods[0].foodType!;
          redisClient
            .pipeline()
            .call("JSON.SET", foodsByTypeKey(), "$", JSON.stringify({}), "NX")
            .call(
              "JSON.SET",
              foodsByTypeKey(),
              formatAsKey(foodType),
              JSON.stringify(foods),
              "NX"
            )
            .expireat(foodsByTypeKey(), expireKeyTomorrow(), "NX")
            .exec();
        }
      }
      return foods;
    }
  } catch (err) {
    throw new Error("There was an error querying foods. " + err);
  }
};

const retrieveRandomFoodData: () => Promise<FoodData[]> = async () => {
  const foods = await retrieveFoodData();
  const randomIndex = Math.floor(Math.random() * foods.length);
  const randomFood = foods[randomIndex];
  return [randomFood];
};

export { retrieveFoodData, retrieveFilteredFoodData, retrieveRandomFoodData };
