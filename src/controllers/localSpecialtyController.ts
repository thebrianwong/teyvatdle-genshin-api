import { AppDataSource } from "../index";
import LocalSpecialty from "../models/localSpecialty.model";
import { LocalSpecialtyData } from "../generated/graphql";

const getLocalSpecialties: () => Promise<LocalSpecialtyData[]> = async () => {
  const localSpecialtyRepo = AppDataSource.getRepository(LocalSpecialty);
  try {
    const localSpecialties: LocalSpecialtyData[] = await localSpecialtyRepo
      .createQueryBuilder("local_specialty")
      .innerJoin("local_specialty.regionId", "region")
      .select([
        'local_specialty.name AS "localSpecialty"',
        "region.name AS region",
        'local_specialty.imageUrl AS "imageUrl"',
      ])
      .getRawMany();
    return localSpecialties;
  } catch (err) {
    throw new Error("There was an error querying local specialties.");
  }
};

export { getLocalSpecialties };
