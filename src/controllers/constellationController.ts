import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Constellation from "../models/constellation.model";

const getConstellations: RequestHandler = async (req, res, next) => {
  const constellationRepo = AppDataSource.getRepository(Constellation);
  const constellations = await constellationRepo
    .createQueryBuilder("constellation")
    .innerJoin("constellation.characterId", "character")
    .select([
      "constellation.name AS constellation_name",
      "character.name AS character",
      "constellation.level AS constellation_level",
      "constellation.imageUrl AS image_url",
    ])
    .getRawMany();
  res.send(constellations);
};

export { getConstellations };
