import { Resolvers } from "../generated/graphql";
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
import localSpecialtyDataResolvers from "./queries/resolvers/field/localSpecialtyData";
import regionDataResolvers from "./queries/resolvers/field/regionData";
import dateScalar from "./scalars/data";

const resolvers: Resolvers = {
  // custom scalars
  Date: dateScalar,

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
  RegionData: regionDataResolvers,
  TalentData: talentDataResolvers,
  WeaponData: weaponDataResolvers,
  DailyRecordData: dailyRecordDataResolvers,

  // mutations
  Mutation: mutationResolvers,

  // subscriptions
  Subscription: subscriptionResolvers,
};

export { resolvers };
