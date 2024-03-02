import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { QueryTalentDataArgs, TalentData } from "../../../generated/graphql";
import {
  retrieveFilteredTalentData,
  retrieveRandomTalentData,
  retrieveTalentData,
} from "../../../controllers/talentController";

const talentDataRootResolvers: (
  parent: any,
  args: QueryTalentDataArgs,
  contextValue: any,
  info: GraphQLResolveInfo
) => Promise<TalentData[]> = async (parent, args, contextValue, info) => {
  if (args.filter === null) {
    throw new GraphQLError("Please enter a filter value.", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  } else if (args.filter) {
    if (Object.keys(args.filter).length > 1) {
      throw new GraphQLError("Please enter a single filter value.", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    } else if ("id" in args.filter) {
      if (args.filter.id === null || args.filter.id === undefined) {
        throw new GraphQLError("Invalid argument. Please enter an id.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      } else {
        if (isNaN(Number(args.filter.id))) {
          throw new GraphQLError("Invalid argument. Please enter a number.", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        } else {
          return retrieveFilteredTalentData("id", args.filter.id);
        }
      }
    } else if ("talentName" in args.filter) {
      if (
        args.filter.talentName === null ||
        args.filter.talentName === undefined
      ) {
        throw new GraphQLError(
          "Invalid argument. Please enter a talent name.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );
      } else {
        return retrieveFilteredTalentData("talentName", args.filter.talentName);
      }
    } else if ("characterName" in args.filter) {
      if (
        args.filter.characterName === null ||
        args.filter.characterName === undefined
      ) {
        throw new GraphQLError(
          "Invalid argument. Please enter a character name.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );
      } else {
        return retrieveFilteredTalentData(
          "characterName",
          args.filter.characterName
        );
      }
    } else if ("random" in args.filter) {
      if (args.filter.random) {
        return retrieveRandomTalentData();
      } else if (args.filter.random === null) {
        throw new GraphQLError(
          'Invalid argument. Please set the argument "random" to "true" or "false".',
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );
      }
    }
  }
  return retrieveTalentData();
};

export default talentDataRootResolvers;
