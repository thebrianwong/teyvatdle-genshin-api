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
import { dailyRecordKey } from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";
import { redisClient, redisPubSub } from "../redis/redis";

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
    throw new Error(`There was an error querying ${type} IDs. ` + err);
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
    throw new Error(
      "There was an error querying recent daily record IDs. " + err
    );
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
  try {
    const cachedDailyRecord = await redisClient
      .call("JSON.GET", dailyRecordKey())
      .then((data) => JSON.parse(data as string));
    if (cachedDailyRecord) {
      return cachedDailyRecord as DailyRecordData;
    } else {
      const currentYear = normalizeYear();
      const currentMonth = normalizeMonth();
      const currentDay = normalizeDay();
      const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
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
      redisClient
        .pipeline()
        .call(
          "JSON.SET",
          dailyRecordKey(),
          "$",
          JSON.stringify(dailyRecord),
          "NX"
        )
        .expireat(dailyRecordKey(), expireKeyTomorrow(), "NX")
        .exec();
      return dailyRecord as DailyRecordData;
    }
  } catch (err) {
    throw new Error("There was an error querying today's daily record. " + err);
  }
};

const retrieveDailyCharacterData: (
  dailyId: string
) => Promise<CharacterData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const characterIdRecord = (await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.character_id AS "characterId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne()) as { characterId: number };
    const characterId = characterIdRecord.characterId;
    try {
      const character = await retrieveFilteredCharacterData(
        "id",
        characterId.toString()
      );
      return character[0];
    } catch (err) {
      throw new Error(
        "There was an error querying today's daily character. " + err
      );
    }
  } catch (err) {
    throw new Error(
      "There was an error querying today's daily character id. " + err
    );
  }
};

const retrieveDailyWeaponData: (
  dailyId: string
) => Promise<WeaponData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const weaponIdRecord = (await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.weapon_id AS "weaponId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne()) as { weaponId: number };
    const weaponId = weaponIdRecord.weaponId;
    try {
      const weapon = await retrieveFilteredWeaponData(
        "id",
        weaponId.toString()
      );
      return weapon[0];
    } catch (err) {
      throw new Error(
        "There was an error querying today's daily weapon. " + err
      );
    }
  } catch (err) {
    throw new Error(
      "There was an error querying today's daily weapon id. " + err
    );
  }
};

const retrieveDailyTalentData: (
  dailyId: string
) => Promise<TalentData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const talentIdRecord = (await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.talent_id AS "talentId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne()) as { talentId: number };
    const talentId = talentIdRecord.talentId;
    try {
      const talent = await retrieveFilteredTalentData(
        "id",
        talentId.toString()
      );
      return talent[0];
    } catch (err) {
      throw new Error(
        "There was an error querying today's daily talent. " + err
      );
    }
  } catch (err) {
    throw new Error(
      "There was an error querying today's daily talent id. " + err
    );
  }
};

const retrieveDailyConstellationData: (
  dailyId: string
) => Promise<ConstellationData> = async (dailyId) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const constellationIdRecord = (await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.constellation_id AS "constellationId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne()) as { constellationId: number };
    const constellationId = constellationIdRecord.constellationId;
    try {
      const constellation = await retrieveFilteredConstellationData(
        "id",
        constellationId.toString()
      );
      return constellation[0];
    } catch (err) {
      throw new Error(
        "There was an error querying today's daily constellation. " + err
      );
    }
  } catch (err) {
    throw new Error(
      "There was an error querying today's daily constellation id. " + err
    );
  }
};

const retrieveDailyFoodData: (dailyId: string) => Promise<FoodData> = async (
  dailyId
) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const foodIdRecord = (await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select(['daily_record.food_id AS "foodId"'])
      .where("daily_record.id = :id", {
        id: dailyId,
      })
      .getRawOne()) as { foodId: number };
    const foodId = foodIdRecord.foodId;
    try {
      const food = await retrieveFilteredFoodData("id", foodId.toString());
      return food[0];
    } catch (err) {
      throw new Error("There was an error querying today's daily food. " + err);
    }
  } catch (err) {
    throw new Error(
      "There was an error querying today's daily food id. " + err
    );
  }
};

const updateDailyRecord: (
  id: string,
  gameDataType: GameDataType
) => Promise<{ message: string; success: boolean }> = async (
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

          redisPubSub.publish("DAILY_RECORD_UPDATED", {
            dailyRecordUpdated: {
              type: gameDataType,
              newSolvedValue,
            },
          });

          const dailyRecordIsCached = await redisClient.call(
            "JSON.TYPE",
            dailyRecordKey()
          );
          if (dailyRecordIsCached) {
            await redisClient.call(
              "JSON.NUMINCRBY",
              dailyRecordKey(),
              `${gameDataType}Solved`,
              1
            );
          }

          return {
            message: `Daily record updated. ${gameDataType}: ${newSolvedValue}`,
            success: true,
          };
        } catch (err) {
          throw new Error(
            `There was an error updating daily record ${id}. ` + err
          );
        }
      } else {
        return {
          message: "Unable to update past daily record.",
          success: false,
        };
      }
    }
  } catch (err) {
    throw new Error(`There was an error querying daily record ${id}. ` + err);
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
