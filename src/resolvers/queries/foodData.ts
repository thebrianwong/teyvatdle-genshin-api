import { FoodData, FoodDataResolvers } from "../../generated/graphql";

const foodDataResolvers: FoodDataResolvers<any, FoodData> = {
  foodId: (parent) => parent.foodId,
  foodName: (parent) => parent.foodName,
  rarity: (parent) => parent.rarity,
  foodType: (parent) => parent.foodType,
  specialDish: (parent) => parent.specialDish,
  purchasable: (parent) => parent.purchasable,
  recipe: (parent) => parent.recipe,
  event: (parent) => parent.event,
  foodImageUrl: (parent) => parent.foodImageUrl,
};

export default foodDataResolvers;
