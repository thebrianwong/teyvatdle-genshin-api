import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Region from "../models/lookups/region.model";
import RegionData from "../types/data/regionData.type";

const getRegions: RequestHandler = async (req, res, next) => {
  const regionRepo = AppDataSource.getRepository(Region);
  try {
    const regions: RegionData[] = await regionRepo
      .createQueryBuilder("region")
      .select(["region.id AS id", "region.name AS name"])
      .getRawMany();
    res.send(regions);
  } catch (err) {
    throw new Error("There was an error querying regions.");
  }
};

export { getRegions };
