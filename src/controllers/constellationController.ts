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

const getConstellations: RequestHandler = async (req, res, next) => {
  const constellationData = await retrieveConstellationData();
  res.send(constellationData);
};

export { getConstellations, retrieveConstellationData };
