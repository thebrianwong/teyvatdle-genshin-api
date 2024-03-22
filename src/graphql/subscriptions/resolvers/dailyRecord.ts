import { pubSub } from "../../..";
import {
  ResolverTypeWrapper,
  SubscriptionResolver,
  UpdatedSolvedValue,
} from "../../../generated/graphql";

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
        pubSub.asyncIterator("DAILY_RECORD_UPDATED"),
    };
  },
};

export default dailyRecordUpdatedResolver;
