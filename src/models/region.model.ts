import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "genshin" })
export default class Region {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
