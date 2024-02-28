import { GraphQLResolveInfo } from "graphql";
import { QueryResolvers } from "../../generated/graphql";
import { retrieveCharacterData } from "../../controllers/characterController";
import { retrieveConstellationData } from "../../controllers/constellationController";
import { retrieveFoodData } from "../../controllers/foodController";
import { retrieveTalentData } from "../../controllers/talentController";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => retrieveCharacterData(),
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
};

export default queryResolvers;
