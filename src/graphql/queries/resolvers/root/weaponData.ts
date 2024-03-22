import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { QueryWeaponDataArgs, WeaponData } from "../../../../generated/graphql";
import {
  retrieveFilteredWeaponData,
  retrieveRandomWeaponData,
  retrieveWeaponData,
} from "../../../../controllers/weaponController";

const weaponDataRootResolvers: (
  parent: any,
  args: QueryWeaponDataArgs,
  contextValue: any,
  info: GraphQLResolveInfo
) => Promise<WeaponData[]> = async (parent, args, contextValue, info) => {
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
          return retrieveFilteredWeaponData("id", args.filter.id);
        }
      }
    } else if ("weaponName" in args.filter) {
      if (
        args.filter.weaponName === null ||
        args.filter.weaponName === undefined
      ) {
        throw new GraphQLError(
          "Invalid argument. Please enter a weapon name.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );
      } else {
        return retrieveFilteredWeaponData("weaponName", args.filter.weaponName);
      }
    } else if ("weaponType" in args.filter) {
      if (
        args.filter.weaponType === null ||
        args.filter.weaponType === undefined
      ) {
        throw new GraphQLError(
          "Invalid argument. Please enter a weapon type.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );
      } else {
        return retrieveFilteredWeaponData("weaponType", args.filter.weaponType);
      }
    } else if ("random" in args.filter) {
      if (args.filter.random) {
        return retrieveRandomWeaponData();
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
  return retrieveWeaponData();
};

export default weaponDataRootResolvers;
