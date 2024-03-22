import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Region from "./region.model";
// import GenshinElement from "../../types/element.type";
import { GenshinElement } from "../../generated/graphql";

@Entity()
export default class Element {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: GenshinElement;

  @Column()
  @OneToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: "associated_region_id" })
  regionId!: number;
}
