import { GraphQLResolveInfo } from "graphql";
import { QueryResolvers } from "../../generated/graphql";
import { retrieveFoodData } from "../../controllers/foodController";
import { retrieveWeaponData } from "../../controllers/weaponController";
import { getDailyRecord } from "../../controllers/teyvatdleGameDataController";
import characterDataRootResolvers from "./root/characterData";
import constellationDataRootResolvers from "./root/constellationData";
import talentDataRootResolvers from "./root/talentData";
import foodDataRootResolvers from "./root/foodData";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: characterDataRootResolvers,
  constellationData: constellationDataRootResolvers,
  foodData: foodDataRootResolvers,
  talentData: talentDataRootResolvers,
  weaponData: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => retrieveWeaponData(),
  dailyRecord: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => getDailyRecord(),
};

export default queryResolvers;
