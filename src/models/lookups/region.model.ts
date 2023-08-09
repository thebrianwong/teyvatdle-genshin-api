import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Region as RegionString } from "../../types/region.type";

@Entity()
export default class Region {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: RegionString;
}
