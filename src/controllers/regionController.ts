import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Region from "../models/lookups/region.model";

const getRegions: RequestHandler = async (req, res, next) => {
  const regionRepo = AppDataSource.getRepository(Region);
  const regions = await regionRepo.find();
  res.send(regions);
};

export { getRegions };
