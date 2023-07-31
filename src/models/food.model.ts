import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import FoodType from "./foodType.model";

@Entity()
export default class Food {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  rarity!: number;

  @Column()
  @ManyToOne(() => FoodType, (foodType) => foodType.id)
  @JoinColumn({ name: "type_id" })
  typeId!: number;

  @Column({ name: "special_dish" })
  specialDish!: boolean;

  @Column()
  purchasable!: boolean;

  @Column()
  recipe!: boolean;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
