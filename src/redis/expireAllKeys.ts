import {
  characterByIdKey,
  characterNameToIdKey,
  charactersKey,
  constellationByIdKey,
  constellationNameToIdKey,
  constellationsByCharacterKey,
  constellationsKey,
  dailyRecordKey,
  foodByIdKey,
  foodNameToIdKey,
  foodsByTypeKey,
  foodsKey,
  localSpecialtiesKey,
  regionsKey,
  talentByIdKey,
  talentNameToIdKey,
  talentsByCharacterKey,
  talentsKey,
  weaponByIdKey,
  weaponNameToIdKey,
  weaponsByTypeKey,
  weaponsKey,
} from "./keys";
import { redisClient } from "./redis";

const expireAllKeys = async () => {
  const keys = [
    dailyRecordKey,
    charactersKey,
    characterByIdKey,
    characterNameToIdKey,
    weaponsKey,
    weaponByIdKey,
    weaponNameToIdKey,
    weaponsByTypeKey,
    foodsKey,
    foodByIdKey,
    foodNameToIdKey,
    foodsByTypeKey,
    talentsKey,
    talentByIdKey,
    talentNameToIdKey,
    talentsByCharacterKey,
    constellationsKey,
    constellationByIdKey,
    constellationNameToIdKey,
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
