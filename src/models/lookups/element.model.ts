import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Region from "./region.model";

@Entity()
export default class Element {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @OneToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: "associated_region_id" })
  regionId!: number;
}
