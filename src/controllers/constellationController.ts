import { AppDataSource } from "../index";
import Constellation from "../models/constellation.model";
import { ConstellationData } from "../generated/graphql";
import {
  constellationByIdKey,
  constellationNameToIdKey,
  constellationsByCharacterKey,
  constellationsKey,
} from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";
import { redisClient } from "../redis/redis";

const retrieveConstellationData: () => Promise<
  ConstellationData[]
> = async () => {
  try {
    const cachedConstellations = await redisClient
      .call("JSON.GET", constellationsKey())
      .then((data) => JSON.parse(data as string));
    if (cachedConstellations) {
      return cachedConstellations as ConstellationData[];
    } else {
      const constellationRepo = AppDataSource.getRepository(Constellation);
      const constellations: ConstellationData[] = await constellationRepo
        .createQueryBuilder("constellation")
        .innerJoin("constellation.characterId", "character")
        .select([
          'constellation.id AS "constellationId"',
          'constellation.name AS "constellationName"',
          'constellation.level AS "constellationLevel"',
          'constellation.imageUrl AS "constellationImageUrl"',
          'constellation.character_id AS "characterId"',
          'character.name AS "characterName"',
          'character.imageUrl AS "characterImageUrl"',
        ])
        .orderBy({ '"constellationId"': "ASC" })
        .getRawMany();
      redisClient
        .pipeline()
        .call(
          "JSON.SET",
          constellationsKey(),
          "$",
          JSON.stringify(constellations)
        )
        .expireat(constellationsKey(), expireKeyTomorrow(), "NX")
        .exec();
      return constellations;
    }
  } catch (err) {
    throw new Error("There was an error querying constellations. " + err);
  }
};

const retrieveFilteredConstellationData: (
  filterType: "id" | "constellationName" | "characterName",
  searchValue: string
) => Promise<ConstellationData[]> = async (filterType, searchValue) => {
  try {
    let constellationCacheKey: string | null = searchValue;
    if (filterType === "constellationName") {
      constellationCacheKey = await redisClient.hget(
        constellationNameToIdKey(),
        searchValue
      );
    }

    let constellationCacheKeyExists;
    if (constellationCacheKey) {
      if (filterType === "characterName") {
        constellationCacheKeyExists = await redisClient.call(
          "JSON.TYPE",
          constellationsByCharacterKey(),
          constellationCacheKey
        );
      } else {
        constellationCacheKeyExists = await redisClient.call(
          "JSON.TYPE",
          constellationByIdKey(),
          constellationCacheKey
        );
      }
    }

    if (constellationCacheKey && constellationCacheKeyExists) {
      if (filterType === "characterName") {
        const constellations = (await redisClient
          .call(
            "JSON.GET",
            constellationsByCharacterKey(),
            constellationCacheKey
          )
          .then((data) => JSON.parse(data as string))) as ConstellationData[];
        return constellations;
      } else {
        const constellations = (await redisClient
          .call("JSON.GET", constellationByIdKey(), constellationCacheKey)
          .then((data) => JSON.parse(data as string))) as ConstellationData[];
        return constellations;
      }
    } else {
      const constellationRepo = AppDataSource.getRepository(Constellation);
      const baseQuery = constellationRepo
        .createQueryBuilder("constellation")
        .innerJoin("constellation.characterId", "character")
        .select([
          'constellation.id AS "constellationId"',
          'constellation.name AS "constellationName"',
          'constellation.level AS "constellationLevel"',
          'constellation.imageUrl AS "constellationImageUrl"',
          'constellation.character_id AS "characterId"',
          'character.name AS "characterName"',
          'character.imageUrl AS "characterImageUrl"',
        ]);
      if (filterType === "id") {
        baseQuery.where("constellation.id = :id", { id: Number(searchValue) });
      } else if (filterType === "constellationName") {
        baseQuery.where("constellation.name = :constellationName", {
          constellationName: searchValue,
        });
      } else if (filterType === "characterName") {
        baseQuery.where("character.name = :characterName", {
          characterName: searchValue,
        });
      }
      const constellations: ConstellationData[] = await baseQuery
        .orderBy({ '"constellationId"': "ASC" })
        .getRawMany();
      if (constellations.length > 0) {
        if (constellations.length === 1) {
          // id or constellation name search
          const constellationId = constellations[0].constellationId!.toString();
          const constellationName = constellations[0].constellationName!;
          redisClient
            .pipeline()
            .call(
              "JSON.SET",
              constellationByIdKey(),
              "$",
              JSON.stringify({}),
              "NX"
            )
            .call(
              "JSON.SET",
              constellationByIdKey(),
              constellationId,
              JSON.stringify(constellations)
            )
            .expireat(constellationByIdKey(), expireKeyTomorrow(), "NX")
            .hset(
              constellationNameToIdKey(),
              constellationName,
              constellationId
            )
            .expireat(constellationNameToIdKey(), expireKeyTomorrow(), "NX")
            .exec();
        } else {
          // character name search
          const characterName = constellations[0].characterName!;
          redisClient
            .pipeline()
            .call(
              "JSON.SET",
              constellationsByCharacterKey(),
              "$",
              JSON.stringify({}),
              "NX"
            )
            .call(
              "JSON.SET",
              constellationsByCharacterKey(),
              characterName,
              JSON.stringify(constellations),
              "NX"
            )
            .expireat(constellationsByCharacterKey(), expireKeyTomorrow(), "NX")
            .exec();
        }
      }
      return constellations;
    }
  } catch (err) {
    throw new Error("There was an error querying constellations. " + err);
  }
};

const retrieveRandomConstellationData: () => Promise<
  ConstellationData[]
> = async () => {
  const constellations = await retrieveConstellationData();
  const randomIndex = Math.floor(Math.random() * constellations.length);
  const randomConstellation = constellations[randomIndex];
  return [randomConstellation];
};

export {
  retrieveConstellationData,
  retrieveFilteredConstellationData,
  retrieveRandomConstellationData,
};
