import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Region {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
