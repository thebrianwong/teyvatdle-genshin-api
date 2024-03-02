import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Constellation from "../models/constellation.model";
// import ConstellationData from "../types/data/constellationData.type";
import { ConstellationData } from "../generated/graphql";

const retrieveConstellationData: () => Promise<
  ConstellationData[]
> = async () => {
  const constellationRepo = AppDataSource.getRepository(Constellation);
  try {
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
    return constellations;
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
  const randomIndex = Math.trunc(Math.random() * constellations.length);
  const randomConstellation = constellations[randomIndex];
  return [randomConstellation];
};

const getConstellations: RequestHandler = async (req, res, next) => {
  const constellationData = await retrieveConstellationData();
  res.send(constellationData);
};

export {
  getConstellations,
  retrieveConstellationData,
  retrieveFilteredConstellationData,
  retrieveRandomConstellationData,
};
