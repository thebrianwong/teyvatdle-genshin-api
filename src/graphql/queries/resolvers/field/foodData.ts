import { FoodData, FoodDataResolvers } from "../../../../generated/graphql";

const foodDataResolvers: FoodDataResolvers<any, FoodData> = {
  foodId: (parent) => parent.foodId || null,
  foodName: (parent) => parent.foodName || null,
  rarity: (parent) => parent.rarity || null,
  foodType: (parent) => parent.foodType || null,
  specialDish: (parent) =>
    typeof parent.specialDish === "boolean" ? parent.specialDish : null,
  purchasable: (parent) =>
    typeof parent.purchasable === "boolean" ? parent.purchasable : null,
  recipe: (parent) =>
    typeof parent.recipe === "boolean" ? parent.recipe : null,
  event: (parent) => (typeof parent.event === "boolean" ? parent.event : null),
  foodImageUrl: (parent) => parent.foodImageUrl || null,
};

export default foodDataResolvers;
