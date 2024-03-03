import { MutationResolvers } from "../../generated/graphql";
import updateDailyRecordMutationResolvers from "./resolvers/dailyRecord";

const mutations: MutationResolvers<any, {}> = {
  updateDailyRecord: updateDailyRecordMutationResolvers,
};

export default mutations;
