import { AppDataSource } from "../index";
import Region from "../models/lookups/region.model";
import { RegionData } from "../generated/graphql";
import { regionsKey } from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";
import { redisClient } from "../redis/redis";

const getRegions: () => Promise<RegionData[]> = async () => {
  try {
    const cachedRegions = await redisClient
      .call("JSON.GET", regionsKey())
      .then((data) => JSON.parse(data as string));
    if (cachedRegions) {
      return cachedRegions as RegionData[];
    } else {
      const regionRepo = AppDataSource.getRepository(Region);
      const regions: RegionData[] = await regionRepo
        .createQueryBuilder("region")
        .select(["region.id AS id", "region.name AS name"])
        .getRawMany();
      await Promise.all([
        redisClient.call(
          "JSON.SET",
          regionsKey(),
          "$",
          JSON.stringify(regions)
        ),
        redisClient.expireat(regionsKey(), expireKeyTomorrow(), "NX"),
      ]);
      return regions;
    }
  } catch (err) {
    throw new Error("There was an error querying regions. " + err);
  }
};

export { getRegions };
