import { AppDataSource } from "../index";
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
import { redisClient } from "../redis/redis";

const retrieveCharacterData: () => Promise<CharacterData[]> = async () => {
  try {
    const cachedCharacters = (await redisClient
      .call("JSON.GET", charactersKey())
      .then((data) => JSON.parse(data as string))) as Array<
      CharacterData & { birthday: string | null }
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
      // await Promise.all([
      //   redisClient.call(
      //     "JSON.SET",
      //     charactersKey(),
      //     "$",
      //     JSON.stringify(characters)
      //   ),
      //   redisClient.expireat(charactersKey(), expireKeyTomorrow(), "NX"),
      // ]);
      redisClient
        .pipeline()
        .call("JSON.SET", charactersKey(), "$", JSON.stringify(characters))
        .expireat(charactersKey(), expireKeyTomorrow(), "NX")
        .exec();
      return characters;
    }
  } catch (err) {
    throw new Error("There was an error querying characters. " + err);
  }
};

const retrieveFilteredCharacterData: (
  filterType: "id" | "characterName",
  searchValue: string
) => Promise<CharacterData[]> = async (filterType, searchValue) => {
  try {
    let characterCacheKey: string | null = searchValue;
    if (filterType === "characterName") {
      characterCacheKey = await redisClient.hget(
        characterNameToIdKey(),
        searchValue
      );
    }

    // check if the characterId key exists in the JSON
    // this is required because running JSON.GET with an nonexistent key throws a Redis error
    const characterCacheKeyExists = characterCacheKey
      ? await redisClient.call(
          "JSON.TYPE",
          characterByIdKey(),
          characterCacheKey
        )
      : null;

    // the characterId could be null if an invalid character name was searched,
    // which would necessarily mean an invalid key and a cache miss
    // if the characterId is valid but that key is not in the JSON, then there is a cache miss
    // in either case, don't bother looking at the cache and instead search the db
    // there is no scenario where an invalid characterId leads to an existing JSON key
    if (characterCacheKey && characterCacheKeyExists) {
      const cachedValue = (await redisClient
        .call("JSON.GET", characterByIdKey(), characterCacheKey)
        .then((data) => JSON.parse(data as string))) as Array<
        CharacterData & { birthday: string | null }
      >;
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
        redisClient
          .pipeline()
          .call("JSON.SET", characterByIdKey(), "$", JSON.stringify({}), "NX")
          .call(
            "JSON.SET",
            characterByIdKey(),
            characterId,
            JSON.stringify(character),
            "NX"
          )
          .expireat(characterByIdKey(), expireKeyTomorrow(), "NX")
          .hset(characterNameToIdKey(), characterName, characterId)
          .expireat(characterNameToIdKey(), expireKeyTomorrow(), "NX")
          .exec();
      }
      return character;
    }
  } catch (err) {
    throw new Error("There was an error querying characters. " + err);
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
