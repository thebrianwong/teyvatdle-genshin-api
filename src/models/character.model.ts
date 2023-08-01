import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import WeaponType from "./lookups/weaponType.model";
import Stat from "./lookups/stat.model";
import EnemyDrop from "./enemyDrop.model";
import Region from "./lookups/region.model";
import Element from "./lookups/element.model";
import LocalSpecialty from "./localSpecialty.model";
import BossDrop from "./bossDrop.model";
import Food from "./food.model";

@Entity()
export default class Character {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  gender!: "Male" | "Female" | "Other";

  @Column()
  height!: "Short" | "Medium" | "Tall";

  @Column()
  rarity!: number;

  @Column()
  @ManyToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: "region_id" })
  regionId!: number;

  @Column()
  @ManyToOne(() => Element, (element) => element.id)
  @JoinColumn({ name: "element_id" })
  elementId!: number;

  @Column()
  @ManyToOne(() => WeaponType, (weaponType) => weaponType.id)
  @JoinColumn({ name: "weapon_type_id" })
  weaponTypeId!: number;

  @Column()
  @ManyToOne(() => Stat, (stat) => stat.id)
  @JoinColumn({ name: "ascension_stat_id" })
  ascensionStatId!: number;

  @Column()
  @ManyToOne(() => LocalSpecialty, (localSpecialty) => localSpecialty.id)
  @JoinColumn({ name: "local_specialty_id" })
  localSpecialtyId!: number;

  @Column()
  @ManyToOne(() => EnemyDrop, (enemyDrop) => enemyDrop.id)
  @JoinColumn({ name: "enhancement_material_id" })
  enhancementMaterialId!: number;

  @Column()
  @ManyToOne(() => BossDrop, (bossDrop) => bossDrop.id)
  @JoinColumn({ name: "normal_boss_material_id" })
  normalBossMaterialId!: number;

  @Column()
  @ManyToOne(() => BossDrop, (bossDrop) => bossDrop.id)
  @JoinColumn({ name: "weekly_boss_material_id" })
  weeklyBossMaterialId!: number;

  @Column()
  @ManyToOne(() => Food, (food) => food.id)
  @JoinColumn({ name: "special_dish_id" })
  specialDishId!: number;

  @Column({ type: "timestamp without time zone" })
  birthday!: Date;

  @Column({ type: "timestamp without time zone", name: "release_date" })
  releaseDate!: Date;

  @Column({ type: "numeric", name: "release_version" })
  releaseVersion!: number;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
