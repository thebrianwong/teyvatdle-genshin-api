import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "weapon_type" })
export default class WeaponType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
