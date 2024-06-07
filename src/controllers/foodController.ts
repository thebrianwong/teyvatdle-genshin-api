import { AppDataSource } from "../index";
import Food from "../models/food.model";
import { FoodData, FoodType } from "../generated/graphql";
import client from "../redis/client";
import {
  foodByIdKey,
  foodNameToIdKey,
  foodsByTypeKey,
  foodsKey,
  formatAsKey,
} from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const retrieveFoodData: () => Promise<FoodData[]> = async () => {
  try {
    const cachedFoods = await client.json.get(foodsKey());
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
      await Promise.all([
        client.json.set(foodsKey(), "$", foods),
        client.expireAt(foodsKey(), expireKeyTomorrow(), "NX"),
      ]);
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
    let foodCacheKey: string | undefined = searchValue;
    if (filterType === "foodName") {
      foodCacheKey = await client.hGet(foodNameToIdKey(), searchValue);
    }

    let foodCacheKeyExists;
    if (filterType === "foodType") {
      foodCacheKeyExists = await client.json.type(
        foodsByTypeKey(),
        // foodType keys have to be formatted due to containing apostrophes and white space
        formatAsKey(foodCacheKey!)
      );
    } else {
      foodCacheKeyExists = await client.json.type(foodByIdKey(), foodCacheKey);
    }

    if (foodCacheKey && foodCacheKeyExists) {
      if (filterType === "foodType") {
        const foods = (await client.json.get(foodsByTypeKey(), {
          path: formatAsKey(foodCacheKey),
        })) as FoodData[];
        return foods;
      } else {
        const foods = (await client.json.get(foodByIdKey(), {
          path: foodCacheKey,
        })) as FoodData[];
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
          await Promise.all([
            client.json.set(foodByIdKey(), "$", {}, { NX: true }),
            client.json.set(foodByIdKey(), foodId, foods, {
              NX: true,
            }),
            client.expireAt(foodByIdKey(), expireKeyTomorrow(), "NX"),
            client.hSet(foodNameToIdKey(), foodName, foodId),
            client.expireAt(foodNameToIdKey(), expireKeyTomorrow(), "NX"),
          ]);
        } else {
          // food type search
          const foodType = foods[0].foodType!;
          await Promise.all([
            client.json.set(foodsByTypeKey(), "$", {}, { NX: true }),
            client.json.set(foodsByTypeKey(), formatAsKey(foodType), foods, {
              NX: true,
            }),
            client.expireAt(foodsByTypeKey(), expireKeyTomorrow(), "NX"),
          ]);
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
