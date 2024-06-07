import { AppDataSource } from "../index";
import Talent from "../models/talent.model";
import { TalentData } from "../generated/graphql";
import client from "../redis/client";
import {
  talentByIdKey,
  talentNameToIdKey,
  talentsByCharacterKey,
  talentsKey,
} from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const retrieveTalentData: () => Promise<TalentData[]> = async () => {
  try {
    const cachedTalents = await client.json.get(talentsKey());
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
      await Promise.all([
        client.json.set(talentsKey(), "$", talents),
        client.expireAt(talentsKey(), expireKeyTomorrow(), "NX"),
      ]);
      return talents;
    }
  } catch (err) {
    throw new Error("There was an error querying talents.");
  }
};

const retrieveFilteredTalentData: (
  filterType: "id" | "talentName" | "characterName",
  searchValue: string
) => Promise<TalentData[]> = async (filterType, searchValue) => {
  try {
    let talentCacheKey: string | undefined = searchValue;
    if (filterType === "talentName") {
      talentCacheKey = await client.hGet(talentNameToIdKey(), searchValue);
    }

    let talentCacheKeyExists;
    if (filterType === "characterName") {
      talentCacheKeyExists = await client.json.type(
        talentsByCharacterKey(),
        talentCacheKey
      );
    } else {
      talentCacheKeyExists = await client.json.type(
        talentByIdKey(),
        talentCacheKey
      );
    }

    if (talentCacheKey && talentCacheKeyExists) {
      if (filterType === "characterName") {
        const talents = (await client.json.get(talentsByCharacterKey(), {
          path: talentCacheKey,
        })) as TalentData[];
        return talents;
      } else {
        const talents = (await client.json.get(talentByIdKey(), {
          path: talentCacheKey,
        })) as TalentData[];
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
          await Promise.all([
            client.json.set(talentByIdKey(), "$", {}, { NX: true }),
            client.json.set(talentByIdKey(), talentId, talents),
            { NX: true },
            client.expireAt(talentByIdKey(), expireKeyTomorrow(), "NX"),
            client.hSet(talentNameToIdKey(), talentName, talentId),
            client.expireAt(talentNameToIdKey(), expireKeyTomorrow(), "NX"),
          ]);
        } else {
          // character name search
          const characterName = talents[0].characterName!;
          await Promise.all([
            client.json.set(talentsByCharacterKey(), "$", {}, { NX: true }),
            client.json.set(talentsByCharacterKey(), characterName, talents, {
              NX: true,
            }),
            client.expireAt(talentsByCharacterKey(), expireKeyTomorrow(), "NX"),
          ]);
        }
      }
      return talents;
    }
  } catch (err) {
    throw new Error("There was an error querying talents.");
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
  retrieveFilteredTalentData,
  retrieveRandomTalentData,
};
