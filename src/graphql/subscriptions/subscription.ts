import { SubscriptionResolvers } from "../../generated/graphql";
import dailyRecordUpdatedResolver from "./resolvers/dailyRecord";

const subscriptionResolvers: SubscriptionResolvers<any, {}> = {
  dailyRecordUpdated: dailyRecordUpdatedResolver,
};

export default subscriptionResolvers;
