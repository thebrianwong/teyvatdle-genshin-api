import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "talent_book" })
export default class TalentBook {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
