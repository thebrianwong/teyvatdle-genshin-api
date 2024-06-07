const APP_KEY_PREFIX = "TEYVATDLE";

const formatAsKey = (unformatted: string) =>
  unformatted.replaceAll(/\s|'/g, "");

const charactersKey = () => `${APP_KEY_PREFIX}#characters`; // key for JSON data structure
const characterByIdKey = () => `${APP_KEY_PREFIX}:character#byId`; // key for JSON data structure, returns character JSON
const characterNameToIdKey = () => `${APP_KEY_PREFIX}:character#nameToId`; // key for Hash data structure, returns character ID to be passed into characterIdKey

const weaponsKey = () => `${APP_KEY_PREFIX}#weapons`; // key for JSON data structure
const weaponByIdKey = () => `${APP_KEY_PREFIX}:weapon#byId`; // key for JSON data structure, returns weapon JSON
const weaponNameToIdKey = () => `${APP_KEY_PREFIX}:weapon#nameToId`; // key for Hash data structure, returns weapon ID to be passed into weaponIdKey
const weaponsByTypeKey = () => `${APP_KEY_PREFIX}:weapons#byType`; // key for JSON data structure, returns all weapons of a provided weaponType path

const foodsKey = () => `${APP_KEY_PREFIX}#foods`; // key for JSON data structure
const foodByIdKey = () => `${APP_KEY_PREFIX}:food#byId`; // key for JSON data structure, returns food JSON
const foodNameToIdKey = () => `${APP_KEY_PREFIX}:food#nameToId`; // key for Hash data structure, returns food ID to be passed into foodIdKey
const foodsByTypeKey = () => `${APP_KEY_PREFIX}:foods#byType`; // key for JSON data structure, returns all foods of a provided foodType path

const talentsKey = () => `${APP_KEY_PREFIX}#talents`; // key for JSON data structure
const talentByIdKey = () => `${APP_KEY_PREFIX}:talent#byId`; // key for JSON data structure, returns talent JSON
const talentNameToIdKey = () => `${APP_KEY_PREFIX}:talent#nameToId`; // key for Hash data structure, returns talent ID to be passed into talentIdKey
const talentsByCharacterKey = () => `${APP_KEY_PREFIX}:talents#byCharacter`; // key for JSON data structure, returns all talent of a provided character path

export {
  formatAsKey,
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
};
