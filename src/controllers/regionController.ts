import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Region from "../models/lookups/region.model";

const getRegions: RequestHandler = async (req, res, next) => {
  const regionRepo = AppDataSource.getRepository(Region);
  try {
    const regions = await regionRepo.find();
    res.send(regions);
  } catch (err) {
    throw new Error("There was an error querying regions.");
  }
};

export { getRegions };
