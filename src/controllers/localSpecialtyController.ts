import { AppDataSource } from "../index";
import LocalSpecialty from "../models/localSpecialty.model";
import { LocalSpecialtyData } from "../generated/graphql";
import client from "../redis/client";
import { localSpecialtiesKey } from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const getLocalSpecialties: () => Promise<LocalSpecialtyData[]> = async () => {
  try {
    const cachedLocalSpecialties = await client.json.get(localSpecialtiesKey());
    if (cachedLocalSpecialties) {
      return cachedLocalSpecialties as LocalSpecialtyData[];
    } else {
      const localSpecialtyRepo = AppDataSource.getRepository(LocalSpecialty);
      const localSpecialties: LocalSpecialtyData[] = await localSpecialtyRepo
        .createQueryBuilder("local_specialty")
        .innerJoin("local_specialty.regionId", "region")
        .select([
          'local_specialty.name AS "localSpecialty"',
          "region.name AS region",
          'local_specialty.imageUrl AS "imageUrl"',
        ])
        .getRawMany();
      await Promise.all([
        client.json.set(localSpecialtiesKey(), "$", localSpecialties),
        client.expireAt(localSpecialtiesKey(), expireKeyTomorrow(), "NX"),
      ]);
      return localSpecialties;
    }
  } catch (err) {
    throw new Error("There was an error querying local specialties.");
  }
};

export { getLocalSpecialties };
