import client from "../redis/client";
import {
  characterByIdKey,
  charactersKey,
  foodByIdKey,
  foodsByTypeKey,
  foodsKey,
  talentByIdKey,
  talentsByCharacterKey,
  talentsKey,
  weaponByIdKey,
  weaponsByTypeKey,
  weaponsKey,
} from "./keys";

const expireAllKeys = async () => {
  const keys = [
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
  ];
  const commands = keys.map((key) => client.json.del(key()));
  await Promise.all(commands);
  await client.quit();
};

(async () => {
  await expireAllKeys();
  console.log("Expiring Keys.");
})();

export default expireAllKeys;