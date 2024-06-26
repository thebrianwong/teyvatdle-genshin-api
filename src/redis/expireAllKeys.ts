import {
  characterByIdKey,
  characterNameToIdKey,
  charactersKey,
  constellationByIdKey,
  constellationNameToIdKey,
  constellationsByCharacterKey,
  constellationsKey,
  constellationsNestedInCharactersKey,
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
  talentsNestedInCharactersKey,
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
    talentsNestedInCharactersKey,
    constellationsKey,
    constellationByIdKey,
    constellationNameToIdKey,
    constellationsByCharacterKey,
    constellationsNestedInCharactersKey,
    regionsKey,
    localSpecialtiesKey,
  ];

  const deleteCommands = keys.reduce(
    (redisClient, key) => redisClient.call("JSON.DEL", key()),
    redisClient.pipeline()
  );
  await deleteCommands.exec();
};

export default expireAllKeys;
