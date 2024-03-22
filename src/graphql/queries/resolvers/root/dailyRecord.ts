import { GraphQLResolveInfo } from "graphql";
import { DailyRecordData } from "../../../../generated/graphql";
import { getDailyRecord } from "../../../../controllers/teyvatdleGameDataController";

const dailyRecordDataRootResolvers: (
  parent: any,
  args: any,
  contextValue: any,
  info: GraphQLResolveInfo
) => Promise<DailyRecordData> = (parent, args, contextValue, info) => {
  return getDailyRecord();
};

export default dailyRecordDataRootResolvers;
