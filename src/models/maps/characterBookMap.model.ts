import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import Character from "../character.model";
import TalentBook from "../talentBook.model";

@Entity({ name: "character_book_map" })
export default class CharacterBookMap {
  @PrimaryColumn({ name: "character_id" })
  @ManyToOne(() => Character, (character) => character.id)
  @JoinColumn({ name: "character_id" })
  characterId!: number;

  @PrimaryColumn({ name: "talent_book_id" })
  @ManyToOne(() => TalentBook, (talentBook) => talentBook.id)
  @JoinColumn({ name: "talent_book_id" })
  talentBookId!: number;
}
