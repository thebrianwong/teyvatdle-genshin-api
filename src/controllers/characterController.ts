import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Character from "../models/character.model";

const getCharacters: RequestHandler = async (req, res, next) => {
  const characterRepo = AppDataSource.getRepository(Character);
  const characters = await characterRepo
    .createQueryBuilder("character")
    .leftJoin("character.regionId", "region")
    .innerJoin("character.elementId", "element")
    .innerJoin("character.weaponTypeId", "weapon_type")
    .innerJoin("character.ascensionStatId", "stat")
    .innerJoin("character.localSpecialtyId", "local_specialty")
    .innerJoin("character.enhancementMaterialId", "enemy_drop")
    .leftJoin("character.normalBossMaterialId", "normal_boss_drop")
    .innerJoin("character.weeklyBossMaterialId", "weekly_boss_drop")
    .leftJoin("character.specialDishId", "food")
    .select([
      "character.name AS character_name",
      "character.gender AS gender",
      "character.height AS height",
      "character.rarity AS rarity",
      "region.name AS region",
      "element.name AS element",
      "weapon_type.name AS weapon_type",
      "stat.name AS ascension_stat",
      "character.birthday AS birthday",
      "character.imageUrl AS character_image_url",
      "local_specialty.name AS local_specialty",
      "local_specialty.imageUrl AS local_specialty_image_url",
      "enemy_drop.name AS enhancement_material",
      "enemy_drop.imageUrl AS enhancement_material_image_url",
      "normal_boss_drop.name AS ascension_boss_material",
      "normal_boss_drop.imageUrl AS ascension_boss_material_image_url",
      "weekly_boss_drop.name AS talent_boss_material",
      "weekly_boss_drop.imageUrl AS talent_boss_material_image_url",
      // "food.name AS special_dish",
      // "character.releaseDate AS release_date",
      // "character.releaseVersion AS release_version",
    ])
    .getRawMany();
  res.send(characters);
};

export { getCharacters };
