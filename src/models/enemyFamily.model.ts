import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "enemy_family" })
export default class EnemyFamily {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: "Common" | "Elite";
}
