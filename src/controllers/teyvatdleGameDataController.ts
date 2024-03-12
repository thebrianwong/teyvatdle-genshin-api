import { retrieveFilteredCharacterData } from "./characterController";
import { retrieveFilteredConstellationData } from "./constellationController";
import { retrieveFilteredFoodData } from "./foodController";
import { retrieveFilteredTalentData } from "./talentController";
import { retrieveFilteredWeaponData } from "./weaponController";
import { AppDataSource } from "..";
import Character from "../models/character.model";
import Weapon from "../models/weapon.model";
import Talent from "../models/talent.model";
import Constellation from "../models/constellation.model";
import Food from "../models/food.model";
import DailyRecord from "../models/dailyRecord.model";
import {
  normalizeDay,
  normalizeMonth,
  normalizeYear,
} from "../utils/normalizeDates";
import TeyvatdleEntityRepo from "../types/teyvatdleEntityRepo.type";
import {
  CharacterData,
  ConstellationData,
  DailyRecordData,
  FoodData,
  GameDataType,
  TalentData,
  WeaponData,
} from "../generated/graphql";
import { pubSub } from "..";

const getCorrespondingRepo: (type: string) => TeyvatdleEntityRepo = (
  type: string
) => {
  let dataRepo: TeyvatdleEntityRepo;
  switch (type) {
    case "character":
      dataRepo = AppDataSource.getRepository(Character);
      break;
    case "weapon":
      dataRepo = AppDataSource.getRepository(Weapon);
      break;
    case "talent":
      dataRepo = AppDataSource.getRepository(Talent);
      break;
    case "constellation":
      dataRepo = AppDataSource.getRepository(Constellation);
      break;
    case "food":
      dataRepo = AppDataSource.getRepository(Food);
      break;
    default:
      break;
  }
  return dataRepo!;
};

const getIds: (type: string) => Promise<{ id: number }[]> = async (
  type: string
) => {
  const dataRepo = getCorrespondingRepo(type);
  try {
    const ids: { id: number }[] = await dataRepo!
      .createQueryBuilder(type)
      .select([`${type}.id AS id`])
      .getRawMany();
    return ids;
  } catch (err) {
    throw new Error(`There was an error querying ${type} IDs.`);
  }
};

const chooseTheDaily: (type: string) => Promise<number> = async (
  type: string
) => {
  const minNumOfDaysWithoutRepeats = 10;
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  const idList = await getIds(type);
  const rowCount = idList.length;
  try {
    const rawRecentDailyIds: { id: number }[] = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select([`daily_record.${type}_id AS id`])
      .orderBy({ date: "DESC" })
      .limit(minNumOfDaysWithoutRepeats)
      .getRawMany();
    const recentDailyIds = rawRecentDailyIds.map((row) => Number(row.id));
    let validDaily = false;
    let chosenDailyId: number;
    while (!validDaily) {
      const randomNumber = Math.floor(Math.random() * rowCount);
      const randomRow = idList[randomNumber];
      if (!recentDailyIds.includes(randomRow.id)) {
        chosenDailyId = randomRow.id;
        validDaily = true;
      }
    }
    return chosenDailyId!;
  } catch (err) {
    throw new Error("There was an error querying recent daily record IDs.");
  }
};

const createDailyRecord: () => Promise<void> = async () => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const [
      dailyCharacterId,
      dailyWeaponId,
      dailyTalentId,
      dailyConstellationId,
      dailyFoodId,
    ] = await Promise.all([
      chooseTheDaily("character"),
      chooseTheDaily("weapon"),
      chooseTheDaily("talent"),
      chooseTheDaily("constellation"),
      chooseTheDaily("food"),
    ]);
    const newDailyRecordId = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .insert()
      .into(DailyRecord)
      .values([
        {
          characterId: dailyCharacterId,
          characterSolved: 0,
          weaponId: dailyWeaponId,
          weaponSolved: 0,
          talentId: dailyTalentId,
          talentSolved: 0,
          constellationId: dailyConstellationId,
          constellationSolved: 0,
          foodId: dailyFoodId,
          foodSolved: 0,
          date: new Date(
            new Date().toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
            })
          ),
        },
      ])
      .returning("id")
      .execute();
    console.log("A new daily record has been created.");
    console.log(`Daily Record ID ${newDailyRecordId.identifiers[0].id}.`);
  } catch (err) {
    throw new Error("There was an error creating a new daily record.");
  }
};

const getDailyRecord: () => Promise<DailyRecordData> = async () => {
  const currentYear = normalizeYear();
  const currentMonth = normalizeMonth();
  const currentDay = normalizeDay();
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const dailyRecord = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select([
        'daily_record.id AS "dailyRecordId"',
        'daily_record.character_id AS "characterId"',
        'daily_record.character_solved AS "characterSolved"',
        'daily_record.weapon_id AS "weaponId"',
        'daily_record.weapon_solved AS "weaponSolved"',
        'daily_record.talent_id AS "talentId"',
        'daily_record.talent_solved AS "talentSolved"',
        'daily_record.constellation_id AS "constellationId"',
        'daily_record.constellation_solved AS "constellationSolved"',
        'daily_record.food_id AS "foodId"',
        'daily_record.food_solved AS "foodSolved"',
      ])
      .where("CAST(date AS DATE) = CAST(:date AS DATE)", {
        date: `${currentYear}-${currentMonth}-${currentDay}`,
      })
      .getRawOne();
    return dailyRecord as DailyRecordData;
  } catch (err) {
    throw new Error("There was an error querying today's daily record.");
  }
};

const retrieveDailyCharacterData: (
  dailyId: string
) => Promise<CharacterData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const characterIdRecord = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.character_id AS "characterId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne();
    const characterId = characterIdRecord.characterId;
    try {
      const character = await retrieveFilteredCharacterData("id", characterId);
      return character[0];
    } catch (err) {
      throw new Error("There was an error querying today's daily character.");
    }
  } catch (err) {
    throw new Error("There was an error querying today's daily character id.");
  }
};

const retrieveDailyWeaponData: (
  dailyId: string
) => Promise<WeaponData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const weaponIdRecord = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.weapon_id AS "weaponId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne();
    const weaponId = weaponIdRecord.weaponId;
    try {
      const weapon = await retrieveFilteredWeaponData("id", weaponId);
      return weapon[0];
    } catch (err) {
      throw new Error("There was an error querying today's daily weapon.");
    }
  } catch (err) {
    throw new Error("There was an error querying today's daily weapon id.");
  }
};

const retrieveDailyTalentData: (
  dailyId: string
) => Promise<TalentData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const talentIdRecord = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.talent_id AS "talentId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne();
    const talentId = talentIdRecord.talentId;
    try {
      const talent = await retrieveFilteredTalentData("id", talentId);
      return talent[0];
    } catch (err) {
      throw new Error("There was an error querying today's daily talent.");
    }
  } catch (err) {
    throw new Error("There was an error querying today's daily talent id.");
  }
};

const retrieveDailyConstellationData: (
  dailyId: string
) => Promise<ConstellationData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const constellationIdRecord = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.constellation_id AS "constellationId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne();
    const constellationId = constellationIdRecord.constellationId;
    try {
      const constellation = await retrieveFilteredConstellationData(
        "id",
        constellationId
      );
      return constellation[0];
    } catch (err) {
      throw new Error(
        "There was an error querying today's daily constellation."
      );
    }
  } catch (err) {
    throw new Error(
      "There was an error querying today's daily constellation id."
    );
  }
};

const retrieveDailyFoodData: (dailyId: string) => Promise<FoodData> = async (
  dailyId
) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const foodIdRecord = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.food_id AS "foodId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne();
    const foodId = foodIdRecord.foodId;
    try {
      const food = await retrieveFilteredFoodData("id", foodId);
      return food[0];
    } catch (err) {
      throw new Error("There was an error querying today's daily food.");
    }
  } catch (err) {
    throw new Error("There was an error querying today's daily food id.");
  }
};

const updateDailyRecord: (
  id: String,
  gameDataType: GameDataType
) => Promise<{ message: string; success: Boolean }> = async (
  id,
  gameDataType
) => {
  const currentYear = normalizeYear();
  const currentMonth = normalizeMonth();
  const currentDay = normalizeDay();
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const targetDailyRecord: { date: Date } | undefined = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(["daily_record.date AS date", "daily_record.id AS id"])
      .where("id = :id", { id })
      .getRawOne();
    if (targetDailyRecord === undefined) {
      return {
        message: "Invalid id number. That daily record does not exist.",
        success: false,
      };
    } else {
      const dailyRecordDate = targetDailyRecord.date;
      if (
        dailyRecordDate.getFullYear() === Number(currentYear) &&
        dailyRecordDate.getMonth() + 1 === Number(currentMonth) &&
        dailyRecordDate.getDate() === Number(currentDay)
      ) {
        try {
          const returnedUpdateResult = await dailyRecordRepo
            .createQueryBuilder()
            .update()
            .set({
              [`${gameDataType}Solved`]: () => `${gameDataType}Solved + 1`,
            })
            .where("id = :id", { id })
            .returning(`${gameDataType}Solved`)
            .execute();
          const newSolvedValue =
            returnedUpdateResult.raw[0][`${gameDataType}_solved`];

          pubSub.publish("DAILY_RECORD_UPDATED", {
            dailyRecordUpdated: {
              type: gameDataType,
              newSolvedValue,
            },
          });

          return {
            message: `Daily record updated. ${gameDataType}: ${newSolvedValue}`,
            success: true,
          };
        } catch (err) {
          throw new Error(`There was an error updating daily record ${id}.`);
        }
      } else {
        return {
          message: "Unable to update past daily record.",
          success: false,
        };
      }
    }
  } catch (err) {
    throw new Error(`There was an error querying daily record ${id}.`);
  }
};

export {
  createDailyRecord,
  getDailyRecord,
  updateDailyRecord,
  retrieveDailyCharacterData,
  retrieveDailyWeaponData,
  retrieveDailyTalentData,
  retrieveDailyConstellationData,
  retrieveDailyFoodData,
};
