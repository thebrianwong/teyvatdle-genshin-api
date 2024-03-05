import { GraphQLResolveInfo } from "graphql";
import {
  GameDataType,
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
import characterDataResolvers from "./queries/resolvers/field/characterData";
import queryResolvers from "./queries/query";
import constellationDataResolvers from "./queries/resolvers/field/constellationData";
import genshinElementEnumsResolvers from "./enums/genshinElement";
import weaponTypeEnumsResolvers from "./enums/weaponType";
import foodTypeEnumsResolvers from "./enums/foodType";
import talentTypeEnumsResolvers from "./enums/talentType";
import foodDataResolvers from "./queries/resolvers/field/foodData";
import talentDataResolvers from "./queries/resolvers/field/talentData";
import weaponDataResolvers from "./queries/resolvers/field/weaponData";
import dailyRecordDataResolvers from "./queries/resolvers/field/dailyRecordData";
import mutationResolvers from "./mutations/mutation";
import gameDataTypeEnumsResolvers from "./enums/gameDataType";
import subscriptionResolvers from "./subscriptions/subscription";
import { pubSub } from "..";
import localSpecialtyDataResolvers from "./queries/resolvers/field/localSpecialtyData";
// import { getGameData } from "../controllers/teyvatdleGameDataController";

const resolvers: Resolvers = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  // enums
  FoodType: foodTypeEnumsResolvers,
  GameDataType: gameDataTypeEnumsResolvers,
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
  LocalSpecialtyData: localSpecialtyDataResolvers,
  TalentData: talentDataResolvers,
  WeaponData: weaponDataResolvers,
  DailyRecordData: dailyRecordDataResolvers,

  // mutations
  Mutation: mutationResolvers,

  // subscriptions
  Subscription: subscriptionResolvers,
};

export { resolvers };
