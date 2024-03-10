import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TalentType as TalentTypeName } from "../../generated/graphql";

@Entity({ name: "talent_type" })
export default class TalentType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: TalentTypeName;
}
