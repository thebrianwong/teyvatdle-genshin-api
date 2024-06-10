import { exit } from "process";
import {
  characterByIdKey,
  charactersKey,
  constellationByIdKey,
  constellationsByCharacterKey,
  constellationsKey,
  dailyRecordKey,
  foodByIdKey,
  foodsByTypeKey,
  foodsKey,
  localSpecialtiesKey,
  regionsKey,
  talentByIdKey,
  talentsByCharacterKey,
  talentsKey,
  weaponByIdKey,
  weaponsByTypeKey,
  weaponsKey,
} from "./keys";
import { redisClient } from "./redis";

const expireAllKeys = async () => {
  const keys = [
    dailyRecordKey,
    charactersKey,
    characterByIdKey,
    weaponsKey,
    weaponByIdKey,
    weaponsByTypeKey,
    foodsKey,
    foodByIdKey,
    foodsByTypeKey,
    talentsKey,
    talentByIdKey,
    talentsByCharacterKey,
    constellationsKey,
    constellationByIdKey,
    constellationsByCharacterKey,
    regionsKey,
    localSpecialtiesKey,
  ];

  const deleteCommands = keys.reduce(
    (redisClient, key) => redisClient.call("JSON.DEL", key()),
    redisClient.pipeline()
  );
  await deleteCommands.exec();
};

(async () => {
  await expireAllKeys();
  console.log("Expiring Keys.");
  await redisClient.quit();
  exit();
})();

export default expireAllKeys;
