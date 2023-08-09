import { FoodType } from "./foodType.type";

type FoodData = {
  food_id: number;
  food_name: string;
  rarity: number;
  food_type: FoodType;
  special_dish: boolean;
  purchasable: boolean;
  recipe: boolean;
  event: boolean;
  food_image_url: string;
};

export default FoodData;
