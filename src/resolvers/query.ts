import { GraphQLResolveInfo } from "graphql";
import {
  // GameData,
  Maybe,
  Resolver,
  ResolverTypeWrapper,
  Resolvers,
} from "../generated/graphql";
import { getGameData } from "../controllers/teyvatdleGameDataController";
import {
  getCharacters,
  retrieveCharacterData,
} from "../controllers/characterController";
// import { getGameData } from "../controllers/teyvatdleGameDataController";

const resolvers: Resolvers = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Gender: {
    Male: "Male",
    Female: "Female",
    Other: "Other",
  },
  Height: {
    Tall: "Tall",
    Medium: "Medium",
    Short: "Short",
  },
  Region: {
    Mondstadt: "Mondstadt",
    Liyue: "Liyue",
    Inazuma: "Inazuma",
    Sumeru: "Sumeru",
    Fontaine: "Fontaine",
    Natlan: "Natlan",
    Snezhnaya: "Snezhnaya",
  },
  Stat: {
    Anemo_DMG_Bonus: "Anemo DMG Bonus",
    ATK: "ATK",
    CRIT_DMG: "CRIT DMG",
    CRIT_Rate: "CRIT Rate",
    Cryo_DMG_Bonus: "Cryo DMG Bonus",
    DEF: "DEF",
    Dendro_DMG_Bonus: "Dendro DMG Bonus",
    Electro_DMG_Bonus: "Electro DMG Bonus",
    Elemental_Mastery: "Elemental Mastery",
    Energy_Recharge: "Energy Recharge",
    Geo_DMG_Bonus: "Geo DMG Bonus",
    Healing_Bonus: "Healing Bonus",
    HP: "HP",
    Hydro_DMG_Bonus: "Hydro DMG Bonus",
    Physical_DMG_Bonus: "Physical DMG Bonus",
    Pyro_DMG_Bonus: "Pyro DMG Bonus",
  },
  Query: {
    characterData: (
      parent: any,
      args: any,
      contextValue: any,
      info: GraphQLResolveInfo
    ) => retrieveCharacterData(),
  },
  CharacterData: {
    characterId: (parent) => parent.characterId,
    characterName: (parent) => parent.characterName,
    gender: (parent) => parent.gender,
    height: (parent) => parent.height,
    rarity: (parent) => parent.rarity,
    region: (parent) => (parent.region ? parent.region : null),
    element: (parent) => parent.element,
    weaponType: (parent) => parent.weaponType,
    ascensionStat: (parent) => parent.ascensionStat,
    birthday: (parent) => (parent.birthday ? parent.birthday : null),
    characterImageUrl: (parent) => parent.characterImageUrl,
    characterCorrectImageUrl: (parent) => parent.characterCorrectImageUrl,
    characterWrongImageUrl: (parent) => parent.characterWrongImageUrl,
    localSpecialty: (parent) => parent.localSpecialty,
    localSpecialtyImageUrl: (parent) => parent.localSpecialtyImageUrl,
    enhancementMaterial: (parent) => parent.enhancementMaterial,
    enhancementMaterialImageUrl: (parent) => parent.enhancementMaterialImageUrl,
    ascensionBossMaterial: (parent) =>
      parent.ascensionBossMaterial ? parent.ascensionBossMaterial : null,
    ascensionBossMaterialImageUrl: (parent) =>
      parent.ascensionBossMaterialImageUrl
        ? parent.ascensionBossMaterialImageUrl
        : null,
    talentBossMaterial: (parent) => parent.talentBossMaterial,
    talentBossMaterialImageUrl: (parent) => parent.talentBossMaterialImageUrl,
    talentBook: (parent) => parent.talentBook,
    talentBookImageUrl: (parent) => parent.talentBookImageUrl,
  },
};

export { resolvers };
