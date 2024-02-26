import { GraphQLResolveInfo } from "graphql";
import { QueryResolvers } from "../../generated/graphql";
import { retrieveCharacterData } from "../../controllers/characterController";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: (
    parent: any,
    args: any,
    contextValue: any,
    info: GraphQLResolveInfo
  ) => retrieveCharacterData(),
};

export default queryResolvers;
