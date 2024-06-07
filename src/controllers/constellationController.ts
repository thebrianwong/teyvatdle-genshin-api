import { AppDataSource } from "../index";
import Constellation from "../models/constellation.model";
import { ConstellationData } from "../generated/graphql";
import { constellationsKey } from "../redis/keys";
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
  searchValue: String
) => Promise<ConstellationData[]> = async (filterType, searchValue) => {
  const constellationRepo = AppDataSource.getRepository(Constellation);
  try {
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
