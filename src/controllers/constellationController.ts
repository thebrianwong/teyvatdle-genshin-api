import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Constellation from "../models/constellation.model";
import ConstellationData from "../types/constellationData.type";

const retrieveConstellationData: () => Promise<
  ConstellationData[]
> = async () => {
  const constellationRepo = AppDataSource.getRepository(Constellation);
  try {
    const constellations: ConstellationData[] = await constellationRepo
      .createQueryBuilder("constellation")
      .innerJoin("constellation.characterId", "character")
      .select([
        "constellation.id AS constellation_id",
        "constellation.name AS constellation_name",
        "constellation.level AS constellation_level",
        "constellation.imageUrl AS constellation_image_url",
        "character.name AS character",
        "character.imageUrl AS character_image_url",
      ])
      .orderBy({ constellation_id: "ASC" })
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
