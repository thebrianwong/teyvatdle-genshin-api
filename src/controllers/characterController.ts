import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Character from "../models/character.model";
import CharacterBookMap from "../models/maps/characterBookMap.model";
import CharacterData1 from "../types/data/characterData.type"; // old manually created type
import { CharacterData } from "../generated/graphql";

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
        'character.id AS "characterId"',
        'character.name AS "characterName"',
        "character.gender AS gender",
        "character.height AS height",
        "character.rarity AS rarity",
        "region.name AS region",
        "element.name AS element",
        'weapon_type.name AS "weaponType"',
        'stat.name AS "ascensionStat"',
        "character.birthday AS birthday",
        'character.imageUrl AS "characterImageUrl"',
        'character.correctImageUrl AS "characterCorrectImageUrl"',
        'character.wrongImageUrl AS "characterWrongImageUrl"',
        'local_specialty.name AS "localSpecialty"',
        'local_specialty.imageUrl AS "localSpecialtyImageUrl"',
        'enemy_drop.name AS "enhancementMaterial"',
        'enemy_drop.imageUrl AS "enhancementMaterialImageUrl"',
        'normal_boss_drop.name AS "ascensionBossMaterial"',
        'normal_boss_drop.imageUrl AS "ascensionBossMaterialImageUrl"',
        'weekly_boss_drop.name AS "talentBossMaterial"',
        'weekly_boss_drop.imageUrl AS "talentBossMaterialImageUrl"',
        'ARRAY_AGG(talent_book.name) AS "talentBook"',
        'ARRAY_AGG(talent_book.image_url) AS "talentBookImageUrl"',
      ])
      .groupBy("character.id")
      .addGroupBy('"characterName"')
      .addGroupBy("gender")
      .addGroupBy("height")
      .addGroupBy("character.rarity")
      .addGroupBy("region")
      .addGroupBy("element")
      .addGroupBy('"weaponType"')
      .addGroupBy('"ascensionStat"')
      .addGroupBy("birthday")
      .addGroupBy('"characterImageUrl"')
      .addGroupBy('"characterCorrectImageUrl"')
      .addGroupBy('"characterWrongImageUrl"')
      .addGroupBy('"localSpecialty"')
      .addGroupBy('"localSpecialtyImageUrl"')
      .addGroupBy('"enhancementMaterial"')
      .addGroupBy('"enhancementMaterialImageUrl"')
      .addGroupBy('"ascensionBossMaterial"')
      .addGroupBy('"ascensionBossMaterialImageUrl"')
      .addGroupBy('"talentBossMaterial"')
      .addGroupBy('"talentBossMaterialImageUrl"')
      .orderBy({ '"characterName"': "ASC" })
      .getRawMany();
    return characters;
  } catch (err) {
    throw new Error("There was an error querying characters.");
  }
};

const retrieveSingleCharacterData: (
  filterType: "id" | "characterName",
  searchValue: String
) => Promise<CharacterData[]> = async (filterType, searchValue) => {
  const characterRepo = AppDataSource.getRepository(Character);
  try {
    const baseQuery = characterRepo
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
        'character.id AS "characterId"',
        'character.name AS "characterName"',
        "character.gender AS gender",
        "character.height AS height",
        "character.rarity AS rarity",
        "region.name AS region",
        "element.name AS element",
        'weapon_type.name AS "weaponType"',
        'stat.name AS "ascensionStat"',
        "character.birthday AS birthday",
        'character.imageUrl AS "characterImageUrl"',
        'character.correctImageUrl AS "characterCorrectImageUrl"',
        'character.wrongImageUrl AS "characterWrongImageUrl"',
        'local_specialty.name AS "localSpecialty"',
        'local_specialty.imageUrl AS "localSpecialtyImageUrl"',
        'enemy_drop.name AS "enhancementMaterial"',
        'enemy_drop.imageUrl AS "enhancementMaterialImageUrl"',
        'normal_boss_drop.name AS "ascensionBossMaterial"',
        'normal_boss_drop.imageUrl AS "ascensionBossMaterialImageUrl"',
        'weekly_boss_drop.name AS "talentBossMaterial"',
        'weekly_boss_drop.imageUrl AS "talentBossMaterialImageUrl"',
        'ARRAY_AGG(talent_book.name) AS "talentBook"',
        'ARRAY_AGG(talent_book.image_url) AS "talentBookImageUrl"',
      ]);

    if (filterType === "id") {
      baseQuery.where("character.id = :id", { id: Number(searchValue) });
    } else if (filterType === "characterName") {
      baseQuery.where("character.name = :name", { name: searchValue });
    }

    const character: CharacterData[] | undefined = await baseQuery
      .groupBy("character.id")
      .addGroupBy('"characterName"')
      .addGroupBy("gender")
      .addGroupBy("height")
      .addGroupBy("character.rarity")
      .addGroupBy("region")
      .addGroupBy("element")
      .addGroupBy('"weaponType"')
      .addGroupBy('"ascensionStat"')
      .addGroupBy("birthday")
      .addGroupBy('"characterImageUrl"')
      .addGroupBy('"characterCorrectImageUrl"')
      .addGroupBy('"characterWrongImageUrl"')
      .addGroupBy('"localSpecialty"')
      .addGroupBy('"localSpecialtyImageUrl"')
      .addGroupBy('"enhancementMaterial"')
      .addGroupBy('"enhancementMaterialImageUrl"')
      .addGroupBy('"ascensionBossMaterial"')
      .addGroupBy('"ascensionBossMaterialImageUrl"')
      .addGroupBy('"talentBossMaterial"')
      .addGroupBy('"talentBossMaterialImageUrl"')
      .orderBy({ '"characterName"': "ASC" })
      .getRawMany();
    return character;
  } catch (err) {
    throw new Error("There was an error querying characters.");
  }
};

const retrieveRandomCharacterData: () => Promise<
  CharacterData[]
> = async () => {
  const characters = await retrieveCharacterData();
  const randomIndex = Math.trunc(Math.random() * characters.length);
  const randomCharacter = characters[randomIndex];
  return [randomCharacter];
};

const getCharacters: RequestHandler = async (req, res, next) => {
  const characterData = await retrieveCharacterData();
  res.send(characterData);
};

export {
  getCharacters,
  retrieveCharacterData,
  retrieveSingleCharacterData,
  retrieveRandomCharacterData,
};
