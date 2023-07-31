import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Region from "./region.model";

@Entity()
export default class Boss {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: "Normal" | "Weekly";

  @Column()
  @ManyToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: "region_id" })
  regionId!: number;
}
