import { AppDataSource } from "../index";
import Region from "../models/lookups/region.model";
import { RegionData } from "../generated/graphql";

const getRegions: () => Promise<RegionData[]> = async () => {
  const regionRepo = AppDataSource.getRepository(Region);
  try {
    const regions: RegionData[] = await regionRepo
      .createQueryBuilder("region")
      .select(["region.id AS id", "region.name AS name"])
      .getRawMany();
    return regions;
  } catch (err) {
    throw new Error("There was an error querying regions.");
  }
};

export { getRegions };
