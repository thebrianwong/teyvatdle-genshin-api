import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "food_type" })
export default class FoodType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
