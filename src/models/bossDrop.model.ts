import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Boss from "./boss.model";

@Entity({ name: "boss_drop" })
export default class BossDrop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @ManyToOne(() => Boss, (boss) => boss.id)
  @JoinColumn({ name: "boss_id" })
  bossId!: number;

  @Column({ type: "text", name: "image_url" })
  imageUrl!: string;
}
