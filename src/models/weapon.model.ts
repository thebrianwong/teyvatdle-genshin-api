import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import WeaponType from "./lookups/weaponType.model";
import Stat from "./lookups/stat.model";
import WeaponDomainMaterial from "./weaponDomainMaterial.model";
import EnemyDrop from "./enemyDrop.model";

@Entity()
export default class Weapon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  rarity!: number;

  @Column()
  @ManyToOne(() => WeaponType, (weaponType) => weaponType.id)
  @JoinColumn({ name: "type_id" })
  typeId!: number;

  @Column()
  @ManyToOne(() => Stat, (stat) => stat.id)
  @JoinColumn({ name: "sub_stat_id" })
  subStatId!: number;

  @Column()
  @ManyToOne(
    () => WeaponDomainMaterial,
    (weaponDomainMaterial) => weaponDomainMaterial.id
  )
  @JoinColumn({ name: "weapon_domain_material_id" })
  weaponDomainMaterialId!: number;

  @Column()
  @ManyToOne(() => EnemyDrop, (enemyDrop) => enemyDrop.id)
  @JoinColumn({ name: "elite_enemy_material_id" })
  eliteEnemyMaterialId!: number;

  @Column()
  @ManyToOne(() => EnemyDrop, (enemyDrop) => enemyDrop.id)
  @JoinColumn({ name: "common_enemy_material_id" })
  commonEnemyMaterialId!: number;

  @Column()
  gacha!: boolean;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
