import { AppDataSource, client } from "../index";
import Character from "../models/character.model";
import CharacterBookMap from "../models/maps/characterBookMap.model";
import { CharacterData } from "../generated/graphql";
import {
  characterByIdKey,
  characterNameToIdKey,
  charactersKey,
} from "../redis/keys";
import { deserializeCharacter } from "../redis/deserialize/deserializeCharacter";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const retrieveCharacterData: () => Promise<CharacterData[]> = async () => {
  try {
    const cachedCharacters = (await client.json.get(charactersKey())) as Array<
      CharacterData & { birthday: string }
    > | null;
    if (cachedCharacters) {
      const characters = cachedCharacters.map((character) =>
        deserializeCharacter(character)
      );
      return characters;
    } else {
      const characterRepo = AppDataSource.getRepository(Character);
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
      await Promise.all([
        await client.json.set(charactersKey(), "$", characters),
        await client.expireAt(charactersKey(), expireKeyTomorrow(), "NX"),
      ]);
      return characters;
    }
  } catch (err) {
    throw new Error("There was an error querying characters.");
  }
};

const retrieveFilteredCharacterData: (
  filterType: "id" | "characterName",
  searchValue: string
) => Promise<CharacterData[]> = async (filterType, searchValue) => {
  try {
    let characterId: string | undefined = searchValue;
    if (filterType === "characterName") {
      characterId = await client.hGet(characterNameToIdKey(), searchValue);
    }

    const cachedValue = (await client.json.get(characterByIdKey(), {
      path: characterId,
    })) as Array<CharacterData & { birthday: string }> | null;

    if (cachedValue) {
      // it should not be possible for an invalid id to be mapped to a cached value
      // this occurs if a value is cached but a search for an invalid character name takes place,
      // causing JSON.GET to not return null for some reason
      if (!characterId) {
        return [];
      }

      const character = cachedValue.map((value) => deserializeCharacter(value));
      return character;
    } else {
      const characterRepo = AppDataSource.getRepository(Character);
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
      if (character.length > 0) {
        const characterId = character[0].characterId!.toString();
        const characterName = character[0].characterName!;
        await Promise.all([
          client.json.set(characterByIdKey(), "$", {}, { NX: true }),
          client.json.set(characterByIdKey(), characterId, character, {
            NX: true,
          }),
          client.expireAt(characterByIdKey(), expireKeyTomorrow(), "NX"),
          client.hSet(characterNameToIdKey(), characterName, characterId),
          client.expireAt(characterNameToIdKey(), expireKeyTomorrow(), "NX"),
        ]);
      }
      return character;
    }
  } catch (err) {
    throw new Error("There was an error querying characters.");
  }
};

const retrieveRandomCharacterData: () => Promise<
  CharacterData[]
> = async () => {
  const characters = await retrieveCharacterData();
  const randomIndex = Math.floor(Math.random() * characters.length);
  const randomCharacter = characters[randomIndex];
  return [randomCharacter];
};

export {
  retrieveCharacterData,
  retrieveFilteredCharacterData,
  retrieveRandomCharacterData,
};
