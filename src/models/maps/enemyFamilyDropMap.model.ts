import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import EnemyFamily from "../enemyFamily.model";
import EnemyDrop from "../enemyDrop.model";

@Entity({ name: "enemy_family_drop_map" })
export default class EnemyFamilyDropMap {
  @PrimaryColumn()
  @ManyToOne(() => EnemyFamily, (enemyFamily) => enemyFamily.id)
  @JoinColumn({ name: "enemy_family_id" })
  enemyFamilyId!: number;

  @PrimaryColumn()
  @ManyToOne(() => EnemyDrop, (enemyDrop) => enemyDrop.id)
  @JoinColumn({ name: "enemy_drop_id" })
  enemyDropId!: number;
}
