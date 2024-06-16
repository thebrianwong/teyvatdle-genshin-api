import { AppDataSource } from "../index";
import Talent from "../models/talent.model";
import { TalentData } from "../generated/graphql";
import {
  talentByIdKey,
  talentNameToIdKey,
  talentsByCharacterKey,
  talentsKey,
  talentsNestedInCharactersKey,
} from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";
import { redisClient } from "../redis/redis";
import crypto from "crypto";

const retrieveTalentData: () => Promise<TalentData[]> = async () => {
  try {
    const cachedTalents = await redisClient
      .call("JSON.GET", talentsKey())
      .then((data) => JSON.parse(data as string));
    if (cachedTalents) {
      return cachedTalents as TalentData[];
    } else {
      const talentRepo = AppDataSource.getRepository(Talent);
      const talents: TalentData[] = await talentRepo
        .createQueryBuilder("talent")
        .innerJoin("talent.characterId", "character")
        .innerJoin("talent.typeId", "talent_type")
        .select([
          'talent.id AS "talentId"',
          'talent.name AS "talentName"',
          'talent_type.name AS "talentType"',
          'talent.imageUrl AS "talentImageUrl"',
          'character.name AS "characterName"',
          'character.imageUrl AS "characterImageUrl"',
        ])
        .orderBy({ '"talentId"': "ASC" })
        .getRawMany();
      redisClient
        .pipeline()
        .call("JSON.SET", talentsKey(), "$", JSON.stringify(talents))
        .expireat(talentsKey(), expireKeyTomorrow(), "NX")
        .exec();
      return talents;
    }
  } catch (err) {
    throw new Error("There was an error querying talents. " + err);
  }
};

const retrieveTalentDataByCharacterNames: (
  names: string[]
) => Promise<TalentData[]> = async (names) => {
  try {
    const characterNamesHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(names), "utf8")
      .digest("hex");
    const talentCacheKeyExists = await redisClient.call(
      "JSON.TYPE",
      talentsNestedInCharactersKey(),
      characterNamesHash
    );
    if (talentCacheKeyExists) {
      const cachedTalents = await redisClient
        .call("JSON.GET", talentsNestedInCharactersKey(), characterNamesHash)
        .then((data) => JSON.parse(data as string));
      return cachedTalents as TalentData[];
    } else {
      const talentRepo = AppDataSource.getRepository(Talent);
      const talents: TalentData[] = await talentRepo
        .createQueryBuilder("talent")
        .innerJoin("talent.characterId", "character")
        .innerJoin("talent.typeId", "talent_type")
        .select([
          'talent.id AS "talentId"',
          'talent.name AS "talentName"',
          'talent_type.name AS "talentType"',
          'talent.imageUrl AS "talentImageUrl"',
          'character.name AS "characterName"',
          'character.imageUrl AS "characterImageUrl"',
        ])
        .where("character.name IN(:...names)", { names })
        .orderBy({ '"talentId"': "ASC" })
        .getRawMany();
      redisClient
        .pipeline()
        .call(
          "JSON.SET",
          talentsNestedInCharactersKey(),
          "$",
          JSON.stringify({}),
          "NX"
        )
        .call(
          "JSON.SET",
          talentsNestedInCharactersKey(),
          characterNamesHash,
          JSON.stringify(talents),
          "NX"
        )
        .expireat(talentsNestedInCharactersKey(), expireKeyTomorrow(), "NX")
        .exec();
      return talents;
    }
  } catch (err) {
    throw new Error(
      "There was an error querying talents based on character names. " + err
    );
  }
};

const retrieveFilteredTalentData: (
  filterType: "id" | "talentName" | "characterName",
  searchValue: string
) => Promise<TalentData[]> = async (filterType, searchValue) => {
  try {
    let talentCacheKey: string | null = searchValue;
    if (filterType === "talentName") {
      talentCacheKey = await redisClient.hget(talentNameToIdKey(), searchValue);
    }

    let talentCacheKeyExists;
    if (talentCacheKey) {
      if (filterType === "characterName") {
        talentCacheKeyExists = await redisClient.call(
          "JSON.TYPE",
          talentsByCharacterKey(),
          talentCacheKey
        );
      } else {
        talentCacheKeyExists = await redisClient.call(
          "JSON.TYPE",
          talentByIdKey(),
          talentCacheKey
        );
      }
    }

    if (talentCacheKey && talentCacheKeyExists) {
      if (filterType === "characterName") {
        const talents = (await redisClient
          .call("JSON.GET", talentsByCharacterKey(), talentCacheKey)
          .then((data) => JSON.parse(data as string))) as TalentData[];
        return talents;
      } else {
        const talents = (await redisClient
          .call("JSON.GET", talentByIdKey(), talentCacheKey)
          .then((data) => JSON.parse(data as string))) as TalentData[];
        return talents;
      }
    } else {
      const talentRepo = AppDataSource.getRepository(Talent);
      const baseQuery = talentRepo
        .createQueryBuilder("talent")
        .innerJoin("talent.characterId", "character")
        .innerJoin("talent.typeId", "talent_type")
        .select([
          'talent.id AS "talentId"',
          'talent.name AS "talentName"',
          'talent_type.name AS "talentType"',
          'talent.imageUrl AS "talentImageUrl"',
          'character.name AS "characterName"',
          'character.imageUrl AS "characterImageUrl"',
        ]);

      if (filterType === "id") {
        baseQuery.where("talent.id = :id", { id: Number(searchValue) });
      } else if (filterType === "talentName") {
        baseQuery.where("talent.name = :talentName", {
          talentName: searchValue,
        });
      } else if (filterType === "characterName") {
        baseQuery.where("character.name = :characterName", {
          characterName: searchValue,
        });
      }
      const talents: TalentData[] = await baseQuery
        .orderBy({ '"talentId"': "ASC" })
        .getRawMany();
      if (talents.length > 0) {
        if (talents.length === 1) {
          // id or talent name search
          const talentId = talents[0].talentId!.toString();
          const talentName = talents[0].talentName!;
          redisClient
            .pipeline()
            .call("JSON.SET", talentByIdKey(), "$", JSON.stringify({}), "NX")
            .call(
              "JSON.SET",
              talentByIdKey(),
              talentId,
              JSON.stringify(talents),
              "NX"
            )
            .expireat(talentByIdKey(), expireKeyTomorrow(), "NX")
            .hset(talentNameToIdKey(), talentName, talentId)
            .expireat(talentNameToIdKey(), expireKeyTomorrow(), "NX")
            .exec();
        } else {
          // character name search
          const characterName = talents[0].characterName!;
          redisClient
            .pipeline()
            .call(
              "JSON.SET",
              talentsByCharacterKey(),
              "$",
              JSON.stringify({}),
              "NX"
            )
            .call(
              "JSON.SET",
              talentsByCharacterKey(),
              characterName,
              JSON.stringify(talents),
              "NX"
            )
            .expireat(talentsByCharacterKey(), expireKeyTomorrow(), "NX")
            .exec();
        }
      }
      return talents;
    }
  } catch (err) {
    throw new Error("There was an error querying talents. " + err);
  }
};

const retrieveRandomTalentData: () => Promise<TalentData[]> = async () => {
  const talents = await retrieveTalentData();
  const randomIndex = Math.floor(Math.random() * talents.length);
  const randomTalent = talents[randomIndex];
  return [randomTalent];
};

export {
  retrieveTalentData,
  retrieveTalentDataByCharacterNames,
  retrieveFilteredTalentData,
  retrieveRandomTalentData,
};
