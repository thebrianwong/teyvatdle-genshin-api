import { GraphQLResolveInfo } from "graphql";
import { QueryResolvers } from "../../generated/graphql";
import { retrieveConstellationData } from "../../controllers/constellationController";
import { retrieveFoodData } from "../../controllers/foodController";
import { retrieveTalentData } from "../../controllers/talentController";
import { retrieveWeaponData } from "../../controllers/weaponController";
import { getDailyRecord } from "../../controllers/teyvatdleGameDataController";
import characterDataRootResolvers from "./root/characterData";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: characterDataRootResolvers,
  constellationData: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => retrieveConstellationData(),
  foodData: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => retrieveFoodData(),
  talentData: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => retrieveTalentData(),
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
