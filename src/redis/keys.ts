const APP_KEY_PREFIX = "TEYVATDLE";

const charactersKey = () => `${APP_KEY_PREFIX}#characters`; // key for JSON data structure
const characterByIdKey = () => `${APP_KEY_PREFIX}:character#byId`; // key for JSON data structure, returns character JSON
const characterNameToIdKey = () => `${APP_KEY_PREFIX}:character#nameToId`; // key for Hash data structure, returns character ID to be passed into characterIdKey

const weaponsKey = () => `${APP_KEY_PREFIX}#weapons`; // key for JSON data structure
const weaponByIdKey = () => `${APP_KEY_PREFIX}:weapon#byId`; // key for JSON data structure, returns weapon JSON
const weaponNameToIdKey = () => `${APP_KEY_PREFIX}:weapon#nameToId`; // key for Hash data structure, returns weapon ID to be passed into weaponIdKey

export {
  charactersKey,
  characterByIdKey,
  characterNameToIdKey,
  weaponsKey,
  weaponByIdKey,
  weaponNameToIdKey,
};
