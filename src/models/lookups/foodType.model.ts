import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FoodType as FoodTypeName } from "../../generated/graphql";

@Entity({ name: "food_type" })
export default class FoodType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: FoodTypeName;
}
