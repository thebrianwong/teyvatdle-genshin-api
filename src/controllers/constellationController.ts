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
      "constellation.level AS constellation_level",
      "constellation.imageUrl AS constellation_image_url",
      "character.name AS character",
      "character.imageUrl AS character_image_url",
    ])
    .getRawMany();
  res.send(constellations);
};

export { getConstellations };
