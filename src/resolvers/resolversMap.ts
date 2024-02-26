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
} from "../controllers/characterController";
import genderEnumsResolvers from "./enums/gender";
import heightEnumsResolvers from "./enums/height";
import regionEnumsResolvers from "./enums/region";
import statEnumsResolvers from "./enums/stat";
import characterDataResolvers from "./queries/characterData";
import queryResolvers from "./queries/query";
// import { getGameData } from "../controllers/teyvatdleGameDataController";

const resolvers: Resolvers = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  // enums
  Gender: genderEnumsResolvers,
  Height: heightEnumsResolvers,
  Region: regionEnumsResolvers,
  Stat: statEnumsResolvers,

  // queries
  Query: queryResolvers,
  CharacterData: characterDataResolvers,
};

export { resolvers };
