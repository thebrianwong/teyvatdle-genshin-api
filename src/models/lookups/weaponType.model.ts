import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { WeaponType as WeaponTypeName } from "../../generated/graphql";

@Entity({ name: "weapon_type" })
export default class WeaponType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: WeaponTypeName;
}
