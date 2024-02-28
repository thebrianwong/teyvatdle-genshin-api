import { GraphQLResolveInfo } from "graphql";
import { QueryResolvers } from "../../generated/graphql";
import { retrieveCharacterData } from "../../controllers/characterController";
import { retrieveConstellationData } from "../../controllers/constellationController";
import { retrieveFoodData } from "../../controllers/foodController";

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
};

export default queryResolvers;
