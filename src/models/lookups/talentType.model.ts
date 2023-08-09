import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TalentType as TalentTypeString } from "../../types/talentType.type";

@Entity({ name: "talent_type" })
export default class TalentType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: TalentTypeString;
}
