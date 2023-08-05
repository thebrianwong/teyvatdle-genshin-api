import { RequestHandler } from "express";
import { retrieveCharacterData } from "./characterController";
import { retrieveConstellationData } from "./constellationController";
import { retrieveFoodData } from "./foodController";
import { retrieveTalentData } from "./talentController";
import { retrieveWeaponData } from "./weaponController";
import { AppDataSource } from "..";
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
};

const getIds = async (type: string) => {
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
  const ids: { id: number }[] = await dataRepo!
    .createQueryBuilder(type)
    .select([`${type}.id AS id`])
    .getRawMany();
  return ids;
};

const chooseTheDaily = async (type: string) => {
  const minNumOfDaysWithoutRepeats = 10;
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  const idList = await getIds(type);
  const rowCount = idList.length;
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
};

const createDailyRecord: RequestHandler = async (req, res, next) => {
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
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
};

const getDailyRecord: RequestHandler = async (req, res, next) => {
  const currentYear = normalizeYear();
  const currentMonth = normalizeMonth();
  const currentDay = normalizeDay();
  const dailyRecordRepo = AppDataSource.getRepository(DailyRecord);
  const dailyRecord = await dailyRecordRepo
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
};

export { getGameData, createDailyRecord, getDailyRecord };
