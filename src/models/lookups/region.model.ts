import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Region as RegionName } from "../../generated/graphql";

@Entity()
export default class Region {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: RegionName;
}
