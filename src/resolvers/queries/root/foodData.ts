import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { FoodData, QueryFoodDataArgs } from "../../../generated/graphql";
import {
  retrieveFilteredFoodData,
  retrieveFoodData,
  retrieveRandomFoodData,
} from "../../../controllers/foodController";

const foodDataRootResolvers: (
  parent: any,
  args: QueryFoodDataArgs,
  contextValue: any,
  info: GraphQLResolveInfo
) => Promise<FoodData[]> = async (parent, args, contextValue, info) => {
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
          return retrieveFilteredFoodData("id", args.filter.id);
        }
      }
    } else if ("foodName" in args.filter) {
      if (args.filter.foodName === null || args.filter.foodName === undefined) {
        throw new GraphQLError("Invalid argument. Please enter a food name.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      } else {
        return retrieveFilteredFoodData("foodName", args.filter.foodName);
      }
    } else if ("foodType" in args.filter) {
      if (args.filter.foodType === null || args.filter.foodType === undefined) {
        throw new GraphQLError("Invalid argument. Please enter a food type.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      } else {
        return retrieveFilteredFoodData("foodType", args.filter.foodType);
      }
    } else if ("random" in args.filter) {
      if (args.filter.random) {
        return retrieveRandomFoodData();
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
  return retrieveFoodData();
};

export default foodDataRootResolvers;
