import { AppDataSource } from "../index";
import LocalSpecialty from "../models/localSpecialty.model";
import { LocalSpecialtyData } from "../generated/graphql";
import { localSpecialtiesKey } from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";
import { redisClient } from "../redis/redis";

const getLocalSpecialties: () => Promise<LocalSpecialtyData[]> = async () => {
  try {
    const cachedLocalSpecialties = await redisClient
      .call("JSON.GET", localSpecialtiesKey())
      .then((data) => JSON.parse(data as string));
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
        redisClient.call(
          "JSON.SET",
          localSpecialtiesKey(),
          "$",
          JSON.stringify(localSpecialties)
        ),
        redisClient.expireat(localSpecialtiesKey(), expireKeyTomorrow(), "NX"),
      ]);
      return localSpecialties;
    }
  } catch (err) {
    throw new Error("There was an error querying local specialties. " + err);
  }
};

export { getLocalSpecialties };
