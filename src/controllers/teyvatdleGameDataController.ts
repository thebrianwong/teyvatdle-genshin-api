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
  const recentDailyIds: { id: number }[] = await dailyRecordRepo
    .createQueryBuilder("daily_record")
    .select([`daily_record.${type}_id AS id`])
    // .orderBy({ [`${type}.id`]: "ASC" })
    .orderBy({ date: "DESC" })
    .limit(minNumOfDaysWithoutRepeats)
    .getRawMany();
  const recentDailyIdsArray = recentDailyIds.map((row) => Number(row.id));
  let validDaily = false;
  let chosenDailyId: number;
  while (!validDaily) {
    const randomNumber = Math.floor(Math.random() * rowCount);
    const randomRow = idList[randomNumber];
    if (!recentDailyIdsArray.includes(randomRow.id)) {
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
  // await dailyRecordRepo.createQueryBuilder("daily_record")
  //   .insert()
  //   .
  // const dailyRecord = new DailyRecord();
  // dailyRecord.character_id = dailyCharacterId;
  // console.log(dailyRecord);

  const newDailyRecordId = await dailyRecordRepo
    .createQueryBuilder("daily_record")
    .insert()
    .into(DailyRecord)
    .values([
      {
        // character_id: dailyCharacterId,
        // characterSolved: 0,
        // weapon_id: dailyWeaponId,
        // weaponSolved: 0,
        // talent_id: dailyTalentId,
        // talentSolved: 0,
        // constellation_id: dailyConstellationId,
        // constellationSolved: 0,
        // food_id: dailyFoodId,
        // foodSolved: 0,
        // date: new Date(),
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
        date: new Date(),
      },
    ])
    .returning("id")
    .execute();

  // const newDailyRecord = dailyRecordRepo.create({
  //   character_id: dailyCharacterId,
  //   characterSolved: 0,
  //   weapon_id: dailyWeaponId,
  //   weaponSolved: 0,
  //   talent_id: dailyTalentId,
  //   talentSolved: 0,
  //   constellation_id: dailyConstellationId,
  //   constellationSolved: 0,
  //   food_id: dailyFoodId,
  //   foodSolved: 0,
  //   date: new Date(),
  // });
  // const newDailyRecord = {
  //   characterId: dailyCharacterId,
  //   characterSolved: 0,
  //   weaponId: dailyWeaponId,
  //   weaponSolved: 0,
  //   talentId: dailyTalentId,
  //   talentSolved: 0,
  //   constellationId: dailyConstellationId,
  //   constellationSolved: 0,
  //   foodId: dailyFoodId,
  //   foodSolved: 0,
  //   date: new Date(),
  // }
  // const test = new DailyRecord();
  // test.characterId = dailyCharacterId;
  // test.characterSolved = 0;
  // test.weaponId = dailyWeaponId;
  // test.weaponSolved = 0;
  // test.talentId = dailyTalentId;
  // test.talentSolved = 0;
  // test.constellationId = dailyConstellationId;
  // test.constellationSolved = 0;
  // test.foodId = dailyFoodId;
  // test.foodSolved = 0;
  // test.date = new Date();
  // await dailyRecordRepo.save(test);
  // const testId = dailyRecordRepo.getId(test);
  // console.log(testId);
  res.send(newDailyRecordId.identifiers);
};

export { getGameData, createDailyRecord };
