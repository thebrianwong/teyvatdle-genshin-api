import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Talent from "../models/talent.model";
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

const retrieveFilteredTalentData: (
  filterType: "id" | "talentName" | "characterName",
  searchValue: String
) => Promise<TalentData[]> = async (filterType, searchValue) => {
  const talentRepo = AppDataSource.getRepository(Talent);
  try {
    const baseQuery = talentRepo
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
      ]);

    if (filterType === "id") {
      baseQuery.where("talent.id = :id", { id: Number(searchValue) });
    } else if (filterType === "talentName") {
      baseQuery.where("talent.name = :talentName", { talentName: searchValue });
    } else if (filterType === "characterName") {
      baseQuery.where("character.name = :characterName", {
        characterName: searchValue,
      });
    }
    const talents = await baseQuery
      .orderBy({ '"talentId"': "ASC" })
      .getRawMany();
    return talents;
  } catch (err) {
    throw new Error("There was an error querying talents.");
  }
};

const retrieveRandomTalentData: () => Promise<TalentData[]> = async () => {
  const talents = await retrieveTalentData();
  const randomIndex = Math.floor(Math.random() * talents.length);
  const randomTalent = talents[randomIndex];
  return [randomTalent];
};

const getTalents: RequestHandler = async (req, res, next) => {
  const talentData = await retrieveTalentData();
  res.send(talentData);
};

export {
  getTalents,
  retrieveTalentData,
  retrieveFilteredTalentData,
  retrieveRandomTalentData,
};
