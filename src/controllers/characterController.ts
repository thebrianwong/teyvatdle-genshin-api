import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Character from "../models/character.model";
import CharacterBookMap from "../models/maps/characterBookMap.model";
import CharacterData from "../types/data/characterData.type";

const retrieveCharacterData: () => Promise<CharacterData[]> = async () => {
  const characterRepo = AppDataSource.getRepository(Character);
  try {
    const characters: CharacterData[] = await characterRepo
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
      .innerJoinAndMapMany(
        "character.test",
        CharacterBookMap,
        "map",
        "character.id = map.characterId"
      )
      .innerJoin("map.talentBookId", "talent_book")
      .select([
        "character.id AS character_id",
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
        "ARRAY_AGG(talent_book.name) AS talent_book",
        "ARRAY_AGG(talent_book.image_url) AS talent_book_image_url",
      ])
      .groupBy("character.id")
      .addGroupBy("character_name")
      .addGroupBy("gender")
      .addGroupBy("height")
      .addGroupBy("character.rarity")
      .addGroupBy("region")
      .addGroupBy("element")
      .addGroupBy("weapon_type")
      .addGroupBy("ascension_stat")
      .addGroupBy("birthday")
      .addGroupBy("character_image_url")
      .addGroupBy("local_specialty")
      .addGroupBy("local_specialty_image_url")
      .addGroupBy("enhancement_material")
      .addGroupBy("enhancement_material_image_url")
      .addGroupBy("ascension_boss_material")
      .addGroupBy("ascension_boss_material_image_url")
      .addGroupBy("talent_boss_material")
      .addGroupBy("talent_boss_material_image_url")
      .orderBy({ character_id: "ASC" })
      .getRawMany();
    return characters;
  } catch (err) {
    throw new Error("There was an error querying characters.");
  }
};

const getCharacters: RequestHandler = async (req, res, next) => {
  const characterData = await retrieveCharacterData();
  res.send(characterData);
};

export { getCharacters, retrieveCharacterData };
