import GenshinElement from "../element.type";
import { Region } from "../region.type";
import { Stat } from "../stat.type";
import { WeaponType } from "../weaponType.type";

type CharacterData = {
  character_id: number;
  character_name: string;
  gender: "Male" | "Female" | "Other";
  height: "Short" | "Medium" | "Tall";
  rarity: number;
  region: Region | null;
  element: GenshinElement;
  weapon_type: WeaponType;
  ascension_stat: Stat;
  birthday: Date | null;
  character_image_url: string;
  character_correct_image_url: string;
  character_wrong_image_url: string;
  local_specialty: string;
  local_specialty_image_url: string;
  enhancement_material: string;
  enhancement_material_image_url: string;
  ascension_boss_material: string | null;
  ascension_boss_material_image_url: string | null;
  talent_boss_material: string;
  talent_boss_material_image_url: string;
  talent_book: string[];
  talent_book_image_url: string[];
};

export default CharacterData;
