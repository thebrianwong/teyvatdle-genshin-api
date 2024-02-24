import { GraphQLResolveInfo } from "graphql";
import {
  // GameData,
  Maybe,
  Resolver,
  ResolverTypeWrapper,
  Resolvers,
} from "../generated/graphql";
import { getGameData } from "../controllers/teyvatdleGameDataController";
import {
  getCharacters,
  retrieveCharacterData,
  testForCharId,
} from "../controllers/characterController";
// import { getGameData } from "../controllers/teyvatdleGameDataController";

const resolvers: Resolvers = {
  Query: {
    characterData: () =>
      // parent: any,
      // args: any,
      // contextValue: any,
      // info: GraphQLResolveInfo
      retrieveCharacterData(),
  },
  CharacterData: {
    // characterId: () => testForCharId(),
    characterId: (parent) => {
      console.log(parent);
      return parent.element;
    },
    // characterId:
    //   ()  => {
    //     return {characterId: "d"}
    //   }
    gender: (parent) => parent.gender,
    // height: (parent) => parent.height,
    // region: (parent) => parent.region,
    element: (parent) => parent.element,
    birthday: (parent) => parent.birthday,
  },
};

export { resolvers };
