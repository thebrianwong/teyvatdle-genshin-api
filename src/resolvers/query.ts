import { GraphQLResolveInfo } from "graphql";
import {
  GameData,
  Maybe,
  Resolver,
  ResolverTypeWrapper,
  Resolvers,
} from "../generated/graphql";
import { getGameData } from "../controllers/teyvatdleGameDataController";
// import { getGameData } from "../controllers/teyvatdleGameDataController";

const resolvers: Resolvers = {
  Query: {
    gameData: (
      parent: any,
      args: any,
      contextValue: any,
      info: GraphQLResolveInfo
    ) => getGameData(),
  },
};

export { resolvers };
