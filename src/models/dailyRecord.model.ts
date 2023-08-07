import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Food from "./food.model";
import Character from "./character.model";
import Talent from "./talent.model";
import Constellation from "./constellation.model";
import Weapon from "./weapon.model";

@Entity({ name: "daily_record" })
export default class DailyRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "character_id" })
  @ManyToOne(() => Character, (character) => character.id)
  @JoinColumn({ name: "character_id" })
  characterId!: number;

  @Column({ name: "character_solved" })
  characterSolved!: number;

  @Column({ name: "talent_id" })
  @ManyToOne(() => Talent, (talent) => talent.id)
  @JoinColumn({ name: "talent_id" })
  talentId!: number;

  @Column({ name: "talent_solved" })
  talentSolved!: number;

  @Column({ name: "constellation_id" })
  @ManyToOne(() => Constellation, (constellation) => constellation.id)
  @JoinColumn({ name: "constellation_id" })
  constellationId!: number;

  @Column({ name: "constellation_solved" })
  constellationSolved!: number;

  @Column({ name: "food_id" })
  @ManyToOne(() => Food, (food) => food.id)
  @JoinColumn({ name: "food_id" })
  foodId!: number;

  @Column({ name: "food_solved" })
  foodSolved!: number;

  @Column({ name: "weapon_id" })
  @ManyToOne(() => Weapon, (weapon) => weapon.id)
  @JoinColumn({ name: "weapon_id" })
  weaponId!: number;

  @Column({ name: "weapon_solved" })
  weaponSolved!: number;

  @Column({ type: "timestamp with time zone" })
  date!: Date;
}
