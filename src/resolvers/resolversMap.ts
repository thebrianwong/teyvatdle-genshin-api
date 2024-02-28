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
import genderEnumsResolvers from "./enums/gender";
import heightEnumsResolvers from "./enums/height";
import regionEnumsResolvers from "./enums/region";
import statEnumsResolvers from "./enums/stat";
import characterDataResolvers from "./queries/characterData";
import queryResolvers from "./queries/query";
import constellationDataResolvers from "./queries/constellationData";
import genshinElementEnumsResolvers from "./enums/genshinElement";
import weaponTypeEnumsResolvers from "./enums/weaponType";
import foodTypeEnumsResolvers from "./enums/foodType";
import talentTypeEnumsResolvers from "./enums/talentType";
import foodDataResolvers from "./queries/foodData";
import talentDataResolvers from "./queries/talentData";
import weaponDataResolvers from "./queries/weaponData";
import dailyRecordDataResolvers from "./queries/dailyRecordData";
// import { getGameData } from "../controllers/teyvatdleGameDataController";

const resolvers: Resolvers = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  // enums
  FoodType: foodTypeEnumsResolvers,
  Gender: genderEnumsResolvers,
  GenshinElement: genshinElementEnumsResolvers,
  Height: heightEnumsResolvers,
  Region: regionEnumsResolvers,
  Stat: statEnumsResolvers,
  TalentType: talentTypeEnumsResolvers,
  WeaponType: weaponTypeEnumsResolvers,

  // queries
  Query: queryResolvers,
  CharacterData: characterDataResolvers,
  ConstellationData: constellationDataResolvers,
  FoodData: foodDataResolvers,
  TalentData: talentDataResolvers,
  WeaponData: weaponDataResolvers,
  DailyRecordData: dailyRecordDataResolvers,
};

export { resolvers };
