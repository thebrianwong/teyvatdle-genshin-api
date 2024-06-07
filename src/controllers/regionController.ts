import { AppDataSource } from "../index";
import Region from "../models/lookups/region.model";
import { RegionData } from "../generated/graphql";
import client from "../redis/client";
import { regionsKey } from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const getRegions: () => Promise<RegionData[]> = async () => {
  try {
    const cachedRegions = await client.json.get(regionsKey());
    if (cachedRegions) {
      return cachedRegions as RegionData[];
    } else {
      const regionRepo = AppDataSource.getRepository(Region);
      const regions: RegionData[] = await regionRepo
        .createQueryBuilder("region")
        .select(["region.id AS id", "region.name AS name"])
        .getRawMany();
      await Promise.all([
        client.json.set(regionsKey(), "$", regions),
        client.expireAt(regionsKey(), expireKeyTomorrow(), "NX"),
      ]);
      return regions;
    }
  } catch (err) {
    throw new Error("There was an error querying regions. " + err);
  }
};

export { getRegions };
