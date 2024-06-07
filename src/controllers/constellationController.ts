import { AppDataSource } from "../index";
import Constellation from "../models/constellation.model";
import { ConstellationData } from "../generated/graphql";
import {
  constellationByIdKey,
  constellationNameToIdKey,
  constellationsByCharacterKey,
  constellationsKey,
} from "../redis/keys";
import client from "../redis/client";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const retrieveConstellationData: () => Promise<
  ConstellationData[]
> = async () => {
  try {
    const cachedConstellations = await client.json.get(constellationsKey());
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
      await Promise.all([
        client.json.set(constellationsKey(), "$", constellations),
        client.expireAt(constellationsKey(), expireKeyTomorrow(), "NX"),
      ]);
      return constellations;
    }
  } catch (err) {
    throw new Error("There was an error querying constellations.");
  }
};

const retrieveFilteredConstellationData: (
  filterType: "id" | "constellationName" | "characterName",
  searchValue: string
) => Promise<ConstellationData[]> = async (filterType, searchValue) => {
  let constellationCacheKey: string | undefined = searchValue;
  if (filterType === "constellationName") {
    constellationCacheKey = await client.hGet(
      constellationNameToIdKey(),
      searchValue
    );
  }

  let constellationCacheKeyExists;
  if (filterType === "characterName") {
    constellationCacheKeyExists = await client.json.type(
      constellationsByCharacterKey(),
      constellationCacheKey
    );
  } else {
    constellationCacheKeyExists = await client.json.type(
      constellationByIdKey(),
      constellationCacheKey
    );
  }

  if (constellationCacheKey && constellationCacheKeyExists) {
    if (filterType === "characterName") {
      const constellations = (await client.json.get(
        constellationsByCharacterKey(),
        {
          path: constellationCacheKey,
        }
      )) as ConstellationData[];
      return constellations;
    } else {
      const constellations = (await client.json.get(constellationByIdKey(), {
        path: constellationCacheKey,
      })) as ConstellationData[];
      return constellations;
    }
  }
  try {
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
        await Promise.all([
          client.json.set(constellationByIdKey(), "$", {}, { NX: true }),
          client.json.set(
            constellationByIdKey(),
            constellationId,
            constellations
          ),
          { NX: true },
          client.expireAt(constellationByIdKey(), expireKeyTomorrow(), "NX"),
          client.hSet(
            constellationNameToIdKey(),
            constellationName,
            constellationId
          ),
          client.expireAt(
            constellationNameToIdKey(),
            expireKeyTomorrow(),
            "NX"
          ),
        ]);
      } else {
        // character name search
        const characterName = constellations[0].characterName!;
        await Promise.all([
          client.json.set(
            constellationsByCharacterKey(),
            "$",
            {},
            { NX: true }
          ),
          client.json.set(
            constellationsByCharacterKey(),
            characterName,
            constellations,
            {
              NX: true,
            }
          ),
          client.expireAt(
            constellationsByCharacterKey(),
            expireKeyTomorrow(),
            "NX"
          ),
        ]);
      }
    }
    return constellations;
  } catch (err) {
    throw new Error("There was an error querying constellations.");
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
