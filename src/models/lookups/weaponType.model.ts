import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { WeaponType as WeaponTypeString } from "../../types/weaponType.type";

@Entity({ name: "weapon_type" })
export default class WeaponType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: WeaponTypeString;
}
