const APP_KEY_PREFIX = "TEYVATDLE";

const charactersKey = () => `${APP_KEY_PREFIX}#characters`; // key for JSON data structure
const characterByIdKey = () => `${APP_KEY_PREFIX}:character#byId`; // key for JSON data structure, returns character JSON
const characterNameToIdKey = () => `${APP_KEY_PREFIX}:character#nameToId`; // key for Hash data structure, returns character ID to be passed into characterIdKey

export { charactersKey, characterByIdKey, characterNameToIdKey };
