import { MutationResolvers } from "../../generated/graphql";
import updateDailyRecordMutationResolvers from "./resolvers/dailyRecord";

const mutationResolvers: MutationResolvers<any, {}> = {
  updateDailyRecord: updateDailyRecordMutationResolvers,
};

export default mutationResolvers;
