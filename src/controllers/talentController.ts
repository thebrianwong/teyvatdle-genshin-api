import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Talent from "../models/talent.model";

const getTalents: RequestHandler = async (req, res, next) => {
  const talentRepo = AppDataSource.getRepository(Talent);
  const talents = await talentRepo
    .createQueryBuilder("talent")
    .innerJoin("talent.characterId", "character")
    .innerJoin("talent.typeId", "talent_type")
    .select([
      "talent.name AS talent_name",
      "character.name AS character",
      "talent_type.name AS talent_type",
      "talent.imageUrl AS image_url",
    ])
    .getRawMany();
  res.send(talents);
};

export { getTalents };
