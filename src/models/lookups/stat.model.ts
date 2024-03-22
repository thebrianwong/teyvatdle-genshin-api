import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Stat as StatName } from "../../generated/graphql";

@Entity()
export default class Stat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: StatName;
}
