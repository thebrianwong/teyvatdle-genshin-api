import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Talent from "../models/talent.model";

const retrieveTalentData = async () => {
  const talentRepo = AppDataSource.getRepository(Talent);
  try {
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
    return talents;
  } catch (err) {
    throw new Error("There was an error querying talents.");
  }
};

const getTalents: RequestHandler = async (req, res, next) => {
  const talentData = await retrieveTalentData();
  res.send(talentData);
};

export { getTalents, retrieveTalentData };
