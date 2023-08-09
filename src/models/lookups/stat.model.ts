import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Stat as StatString } from "../../types/stat.type";

@Entity()
export default class Stat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: StatString;
}
