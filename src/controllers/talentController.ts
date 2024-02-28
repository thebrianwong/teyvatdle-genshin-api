import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Talent from "../models/talent.model";
// import TalentData from "../types/data/talentData.type";
import { TalentData } from "../generated/graphql";

const retrieveTalentData: () => Promise<TalentData[]> = async () => {
  const talentRepo = AppDataSource.getRepository(Talent);
  try {
    const talents: TalentData[] = await talentRepo
      .createQueryBuilder("talent")
      .innerJoin("talent.characterId", "character")
      .innerJoin("talent.typeId", "talent_type")
      .select([
        'talent.id AS "talentId"',
        'talent.name AS "talentName"',
        'talent_type.name AS "talentType"',
        'talent.imageUrl AS "talentImageUrl"',
        'character.name AS "characterName"',
        'character.imageUrl AS "characterImageUrl"',
      ])
      .orderBy({ '"talentId"': "ASC" })
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
