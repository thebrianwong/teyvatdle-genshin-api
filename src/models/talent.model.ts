import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Character from "./character.model";
import TalentType from "./talentType.model";

@Entity()
export default class Talent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "talent_name" })
  talentName!: string;

  @Column()
  @ManyToOne(() => Character, (character) => character.id)
  @JoinColumn({ name: "character_id" })
  characterId!: number;

  @Column()
  @ManyToOne(() => TalentType, (talentType) => talentType.id)
  @JoinColumn({ name: "type_id" })
  typeId!: number;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
