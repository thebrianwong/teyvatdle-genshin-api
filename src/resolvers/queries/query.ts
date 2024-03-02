import { GraphQLResolveInfo } from "graphql";
import { QueryResolvers } from "../../generated/graphql";
import { getDailyRecord } from "../../controllers/teyvatdleGameDataController";
import characterDataRootResolvers from "./root/characterData";
import constellationDataRootResolvers from "./root/constellationData";
import talentDataRootResolvers from "./root/talentData";
import foodDataRootResolvers from "./root/foodData";
import weaponDataRootResolvers from "./root/weaponData";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: characterDataRootResolvers,
  constellationData: constellationDataRootResolvers,
  foodData: foodDataRootResolvers,
  talentData: talentDataRootResolvers,
  weaponData: weaponDataRootResolvers,
  dailyRecordData: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => getDailyRecord(),
};

export default queryResolvers;
