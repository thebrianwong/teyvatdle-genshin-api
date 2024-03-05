import { getRegions } from "../../../../controllers/regionController";
import { RegionData } from "../../../../generated/graphql";

const regionDataRootResolvers: () => Promise<RegionData[]> = async () => {
  return getRegions();
};

export default regionDataRootResolvers;
