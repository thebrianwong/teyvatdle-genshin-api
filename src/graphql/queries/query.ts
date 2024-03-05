import { QueryResolvers } from "../../generated/graphql";
import characterDataRootResolvers from "./resolvers/root/characterData";
import constellationDataRootResolvers from "./resolvers/root/constellationData";
import talentDataRootResolvers from "./resolvers/root/talentData";
import foodDataRootResolvers from "./resolvers/root/foodData";
import weaponDataRootResolvers from "./resolvers/root/weaponData";
import dailyRecordDataRootResolvers from "./resolvers/root/dailyRecord";
import localSpecialtyDataResolvers from "./resolvers/root/localSpecialtyData";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: characterDataRootResolvers,
  constellationData: constellationDataRootResolvers,
  foodData: foodDataRootResolvers,
  localSpecialtyData: localSpecialtyDataResolvers,
  talentData: talentDataRootResolvers,
  weaponData: weaponDataRootResolvers,
  dailyRecordData: dailyRecordDataRootResolvers,
};

export default queryResolvers;
