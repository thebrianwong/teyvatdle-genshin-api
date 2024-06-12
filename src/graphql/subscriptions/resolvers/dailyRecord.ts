import {
  ResolverTypeWrapper,
  SubscriptionResolver,
  UpdatedSolvedValue,
} from "../../../generated/graphql";
import { redisPubSub } from "../../../redis/redis";

const dailyRecordUpdatedResolver: SubscriptionResolver<
  ResolverTypeWrapper<UpdatedSolvedValue>,
  "dailyRecordUpdated",
  {},
  any,
  {}
> = {
  subscribe: () => {
    return {
      [Symbol.asyncIterator]: () =>
        redisPubSub.asyncIterator("DAILY_RECORD_UPDATED"),
    };
  },
};

export default dailyRecordUpdatedResolver;
