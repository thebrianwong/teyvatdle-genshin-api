import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Character from "./character.model";

@Entity()
export default class Constellation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @ManyToOne(() => Character, (character) => character.id)
  @JoinColumn({ name: "character_id" })
  characterId!: number;

  @Column()
  level!: number;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
