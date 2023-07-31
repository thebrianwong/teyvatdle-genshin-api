import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Stat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
