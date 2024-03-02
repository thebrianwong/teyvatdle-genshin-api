import { QueryResolvers } from "../../generated/graphql";
import characterDataRootResolvers from "./root/characterData";
import constellationDataRootResolvers from "./root/constellationData";
import talentDataRootResolvers from "./root/talentData";
import foodDataRootResolvers from "./root/foodData";
import weaponDataRootResolvers from "./root/weaponData";
import dailyRecordDataRootResolvers from "./root/dailyRecord";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: characterDataRootResolvers,
  constellationData: constellationDataRootResolvers,
  foodData: foodDataRootResolvers,
  talentData: talentDataRootResolvers,
  weaponData: weaponDataRootResolvers,
  dailyRecordData: dailyRecordDataRootResolvers,
};

export default queryResolvers;
