import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "enemy_drop" })
export default class EnemyDrop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
