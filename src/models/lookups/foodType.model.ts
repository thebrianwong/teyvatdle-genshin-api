import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FoodType as FoodTypeString } from "../../types/foodType.type";

@Entity({ name: "food_type" })
export default class FoodType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: FoodTypeString;
}
