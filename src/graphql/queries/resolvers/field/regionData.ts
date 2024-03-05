import { RegionData, RegionDataResolvers } from "../../../../generated/graphql";

const regionDataResolvers: RegionDataResolvers<any, RegionData> = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
};

export default regionDataResolvers;
