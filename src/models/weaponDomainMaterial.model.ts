import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Region from "./lookups/region.model";

@Entity({ name: "weapon_domain_material" })
export default class WeaponDomainMaterial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @ManyToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: "region_id" })
  regionId!: number;

  @Column({ name: "image_url" })
  imageUrl!: string;
}
