import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import Character from "./character.model";
import TalentBook from "./talentBook.model";

@Entity({ name: "character_book_map" })
export default class CharacterBookMap {
  @PrimaryColumn()
  @ManyToOne(() => Character, (character) => character.id)
  @JoinColumn({ name: "character_id" })
  characterId!: number;

  @PrimaryColumn()
  @ManyToOne(() => TalentBook, (talentBook) => talentBook.id)
  @JoinColumn({ name: "talent_book_id" })
  talentBookId!: number;
}
