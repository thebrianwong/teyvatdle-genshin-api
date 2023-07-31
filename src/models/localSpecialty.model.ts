import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Region from "./region.model";

@Entity({ name: "local_specialty" })
export default class LocalSpecialty {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;

  @Column()
  @ManyToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: "region_id" })
  regionId!: number;
}
