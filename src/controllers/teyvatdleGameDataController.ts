import { RequestHandler } from "express";
import { retrieveCharacterData } from "./characterController";
import { retrieveConstellationData } from "./constellationController";
import { retrieveFoodData } from "./foodController";
import { retrieveTalentData } from "./talentController";
import { retrieveWeaponData } from "./weaponController";
import { AppDataSource, webSocketServer } from "..";
import Character from "../models/character.model";
import Weapon from "../models/weapon.model";
import Talent from "../models/talent.model";
import Constellation from "../models/constellation.model";
import Food from "../models/food.model";
import { Repository } from "typeorm";
import DailyRecord from "../models/dailyRecord.model";
import {
  normalizeDay,
  normalizeMonth,
  normalizeYear,
} from "../utils/normalizeDates";

const getGameData: RequestHandler = async (req, res, next) => {
  try {
    const [characterData, weaponData, talentData, constellationData, foodData] =
      await Promise.all([
        retrieveCharacterData(),
        retrieveWeaponData(),
        retrieveTalentData(),
        retrieveConstellationData(),
        retrieveFoodData(),
      ]);
    const gameData = {
      characterData,
      weaponData,
      talentData,
      constellationData,
      foodData,
    };
    res.send(gameData);
  } catch (err) {
    throw new Error("There was an error querying game data.");
  }
};

const getCorrespondingRepo = (type: string) => {
  let dataRepo:
    | Repository<Character>
    | Repository<Weapon>
    | Repository<Talent>
    | Repository<Constellation>
    | Repository<Food>;
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

const createDailyRecord: RequestHandler = async (req, res, next) => {
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
    res.send(newDailyRecordId.identifiers);
  } catch (err) {
    throw new Error("There was an error creating a new daily record.");
  }
};

const getDailyRecord: RequestHandler = async (req, res, next) => {
  const currentYear = normalizeYear();
  const currentMonth = normalizeMonth();
  const currentDay = normalizeDay();
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  try {
    const dailyRecord:
      | {
          daily_record_id: number;
          character_id: number;
          weapon_id: number;
          talent_id: number;
          constellation_id: number;
          food_id: number;
        }
      | undefined = await dailyRecordRepo
      .createQueryBuilder("daily_record")
      .select([
        "daily_record.id AS daily_record_id",
        "daily_record.character_id AS character_id ",
        "daily_record.weapon_id AS weapon_id ",
        "daily_record.talent_id AS talent_id",
        "daily_record.constellation_id AS constellation_id",
        "daily_record.food_id AS food_id",
      ])
      .where("CAST(date AS DATE) = CAST(:date AS DATE)", {
        date: `${currentYear}-${currentMonth}-${currentDay}`,
      })
      .getRawOne();
    res.send(dailyRecord);
  } catch (err) {
    throw new Error("There was an error querying today's daily record.");
  }
};

const updateDailyRecord: RequestHandler = async (req, res, next) => {
  const { id, type } = req.params;
  const validResources = [
    "character",
    "weapon",
    "talent",
    "constellation",
    "food",
  ];
  if (!validResources.includes(type)) {
    return res
      .status(400)
      .send({ message: "That is not a valid resource.", success: false });
  }
  // If the id param is not even a number, this skips having to query the database
  if (isNaN(Number(id))) {
    return res
      .status(404)
      .send({ message: "That daily record does not exist.", success: false });
  }
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
      return res
        .status(404)
        .send({ message: "That daily record does not exist.", success: false });
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
              [`${type}Solved`]: () => `${type}Solved + 1`,
            })
            .where("id = :id", { id })
            .returning(`${type}Solved`)
            .execute();
          const newSolvedValue = returnedUpdateResult.raw[0][`${type}_solved`];
          webSocketServer.emit(`updateSolvedValue`, type, {
            [`${type}_solved`]: newSolvedValue,
          });
          return res
            .status(200)
            .send({ message: "Daily record updated.", success: true });
        } catch (err) {
          throw new Error(`There was an error updating daily record ${id}.`);
        }
      } else {
        return res.status(500).send({
          message: "Unable to update past daily record.",
          success: false,
        });
      }
    }
  } catch (err) {
    throw new Error(`There was an error querying daily record ${id}.`);
  }
};

export { getGameData, createDailyRecord, getDailyRecord, updateDailyRecord };
