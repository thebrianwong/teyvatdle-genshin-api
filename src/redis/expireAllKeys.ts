import client from "../redis/client";
import {
  characterByIdKey,
  charactersKey,
  foodByIdKey,
  foodsByTypeKey,
  foodsKey,
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
  ];
  const commands = keys.map((key) => client.json.del(key()));
  await Promise.all(commands);
  await client.quit();
};

(async () => {
  console.log("Expiring Keys.");
  await expireAllKeys();
})();

export default expireAllKeys;
