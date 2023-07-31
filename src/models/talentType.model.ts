import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "talent_type" })
export default class TalentType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
