import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { QueryResolvers } from "../../generated/graphql";
import {
  retrieveCharacterData,
  retrieveSingleCharacterData,
} from "../../controllers/characterController";
import { retrieveConstellationData } from "../../controllers/constellationController";
import { retrieveFoodData } from "../../controllers/foodController";
import { retrieveTalentData } from "../../controllers/talentController";
import { retrieveWeaponData } from "../../controllers/weaponController";
import { getDailyRecord } from "../../controllers/teyvatdleGameDataController";
import { QueryCharacterDataArgs } from "../../generated/graphql";

const queryResolvers: QueryResolvers<any, {}> = {
  characterData: async (
    parent: any,
    args: QueryCharacterDataArgs,
    contextValue: any,
    info: GraphQLResolveInfo
    // ) => retrieveCharacterData(),
  ) => {
    if (args.filter === null) {
      throw new GraphQLError("Please enter a filter value.", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    } else if (args.filter) {
      if ("id" in args.filter && "name" in args.filter) {
        throw new GraphQLError("Please enter a single filter value.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      } else if (args.filter.id) {
        if (isNaN(Number(args.filter.id))) {
          throw new GraphQLError("Invalid argument. Please enter a number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        } else {
          return await retrieveSingleCharacterData("id", args.filter.id);
        }
      } else if (args.filter.name) {
        return await retrieveSingleCharacterData("name", args.filter.name);
      }
    }
    return retrieveCharacterData();
  },
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
