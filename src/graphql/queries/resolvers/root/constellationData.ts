import { GraphQLError, GraphQLResolveInfo } from "graphql";
import {
  ConstellationData,
  QueryConstellationDataArgs,
} from "../../../../generated/graphql";
import {
  retrieveConstellationData,
  retrieveFilteredConstellationData,
  retrieveRandomConstellationData,
} from "../../../../controllers/constellationController";

const constellationDataRootResolvers: (
  parent: any,
  args: QueryConstellationDataArgs,
  contextValue: any,
  info: GraphQLResolveInfo
) => Promise<ConstellationData[]> = async (
  parent,
  args,
  contextValue,
  info
) => {
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
          return retrieveFilteredConstellationData("id", args.filter.id);
        }
      }
    } else if ("constellationName" in args.filter) {
      if (
        args.filter.constellationName === null ||
        args.filter.constellationName === undefined
      ) {
        throw new GraphQLError(
          "Invalid argument. Please enter a constellation name.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );
      } else {
        return retrieveFilteredConstellationData(
          "constellationName",
          args.filter.constellationName
        );
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
        return retrieveFilteredConstellationData(
          "characterName",
          args.filter.characterName
        );
      }
    } else if ("random" in args.filter) {
      if (args.filter.random) {
        return retrieveRandomConstellationData();
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
  return retrieveConstellationData();
};

export default constellationDataRootResolvers;
