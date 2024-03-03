import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { MutationUpdateDailyRecordArgs } from "../../../generated/graphql";
import { updateDailyRecord } from "../../../controllers/teyvatdleGameDataController";

const updateDailyRecordMutationResolvers: (
  parent: any,
  args: MutationUpdateDailyRecordArgs,
  contextValue: any,
  info: GraphQLResolveInfo
) => Promise<string> = async (parent, args, contextValue, info) => {
  if (isNaN(Number(args.id))) {
    throw new GraphQLError("Invalid argument. Please enter an id number.", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
  const result = await updateDailyRecord(args.id, args.type);
  if (result.success) {
    return result.message;
  } else {
    if (result.message === "Unable to update past daily record.") {
      throw new GraphQLError(result.message, {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    } else {
      throw new GraphQLError(result.message, {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    }
  }
};

export default updateDailyRecordMutationResolvers;
