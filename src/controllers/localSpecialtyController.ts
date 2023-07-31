import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import LocalSpecialty from "../models/localSpecialty.model";

const getLocalSpecialties: RequestHandler = async (req, res, next) => {
  const localSpecialtyRepo = AppDataSource.getRepository(LocalSpecialty);
  const localSpecialties = await localSpecialtyRepo
    .createQueryBuilder("local_specialty")
    .innerJoin("local_specialty.regionId", "region")
    .select([
      "local_specialty.name AS local_specialty",
      "region.name AS region",
      "local_specialty.imageUrl AS image_url",
    ])
    .getRawMany();
  res.send(localSpecialties);
};

export { getLocalSpecialties };
