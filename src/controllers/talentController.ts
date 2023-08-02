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
      "talent.id AS talent_id",
      "talent.name AS talent_name",
      "talent_type.name AS talent_type",
      "talent.imageUrl AS talent_image_url",
      "character.name AS character",
      "character.imageUrl AS character_image_url",
    ])
    .orderBy({ talent_id: "ASC" })
    .getRawMany();
  res.send(talents);
};

export { getTalents };
