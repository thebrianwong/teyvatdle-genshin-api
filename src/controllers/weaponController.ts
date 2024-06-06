import { AppDataSource, client } from "../index";
import Weapon from "../models/weapon.model";
import { WeaponData, WeaponType } from "../generated/graphql";
import {
  weaponByIdKey,
  weaponNameToIdKey,
  weaponsByTypeKey,
  weaponsKey,
} from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const retrieveWeaponData: () => Promise<WeaponData[]> = async () => {
  try {
    const cachedWeapons = await client.json.get(weaponsKey());
    if (cachedWeapons) {
      return cachedWeapons as WeaponData[];
    } else {
      const weaponRepo = AppDataSource.getRepository(Weapon);
      const weapons: WeaponData[] = await weaponRepo
        .createQueryBuilder("weapon")
        .innerJoin("weapon.typeId", "weapon_type")
        .leftJoin("weapon.subStatId", "stat")
        .innerJoin("weapon.weaponDomainMaterialId", "weapon_domain_material")
        .innerJoin("weapon.eliteEnemyMaterialId", "elite_enemy_drop")
        .innerJoin("weapon.commonEnemyMaterialId", "common_enemy_drop")
        .select([
          'weapon.id AS "weaponId"',
          'weapon.name AS "weaponName"',
          "weapon.rarity AS rarity",
          'weapon_type.name AS "weaponType"',
          'stat.name AS "subStat"',
          'weapon.imageUrl AS "weaponImageUrl"',
          'weapon_domain_material.name AS "weaponDomainMaterial"',
          'weapon_domain_material.imageUrl AS "weaponDomainMaterialImageUrl"',
          'elite_enemy_drop.name AS "eliteEnemyMaterial"',
          'elite_enemy_drop.imageUrl AS "eliteEnemyMaterialImageUrl"',
          'common_enemy_drop.name AS "commonEnemyMaterial"',
          'common_enemy_drop.imageUrl AS "commonEnemyMaterialImageUrl"',
          "weapon.gacha AS gacha",
        ])
        .orderBy({ '"weaponName"': "ASC" })
        .getRawMany();
      await Promise.all([
        client.json.set(weaponsKey(), "$", weapons),
        client.expireAt(weaponsKey(), expireKeyTomorrow(), "NX"),
      ]);
      return weapons;
    }
  } catch (err) {
    throw new Error("There was an error querying weapons.");
  }
};

const retrieveFilteredWeaponData: (
  filterType: "id" | "weaponName" | "weaponType",
  searchValue: string | WeaponType
) => Promise<WeaponData[]> = async (filterType, searchValue) => {
  try {
    let weaponCacheKey: string | undefined = searchValue;
    if (filterType === "weaponName") {
      weaponCacheKey = await client.hGet(weaponNameToIdKey(), searchValue);
    }

    // weaponType has its own JSON consisting of all the weapon data of each weapon type
    // single weapons cached by their ids are stored in separate JSON
    let weaponCacheKeyExists;
    if (filterType === "weaponType") {
      weaponCacheKeyExists = await client.json.type(
        weaponsByTypeKey(),
        weaponCacheKey
      );
    } else {
      weaponCacheKeyExists = await client.json.type(
        weaponByIdKey(),
        weaponCacheKey
      );
    }

    if (weaponCacheKey && weaponCacheKeyExists) {
      if (filterType === "weaponType") {
        const weapons = (await client.json.get(weaponsByTypeKey(), {
          path: weaponCacheKey,
        })) as WeaponData[];
        return weapons;
      } else {
        const weapons = (await client.json.get(weaponByIdKey(), {
          path: weaponCacheKey,
        })) as WeaponData[];
        return weapons;
      }
    } else {
      const weaponRepo = AppDataSource.getRepository(Weapon);
      const baseQuery = weaponRepo
        .createQueryBuilder("weapon")
        .innerJoin("weapon.typeId", "weapon_type")
        .leftJoin("weapon.subStatId", "stat")
        .innerJoin("weapon.weaponDomainMaterialId", "weapon_domain_material")
        .innerJoin("weapon.eliteEnemyMaterialId", "elite_enemy_drop")
        .innerJoin("weapon.commonEnemyMaterialId", "common_enemy_drop")
        .select([
          'weapon.id AS "weaponId"',
          'weapon.name AS "weaponName"',
          "weapon.rarity AS rarity",
          'weapon_type.name AS "weaponType"',
          'stat.name AS "subStat"',
          'weapon.imageUrl AS "weaponImageUrl"',
          'weapon_domain_material.name AS "weaponDomainMaterial"',
          'weapon_domain_material.imageUrl AS "weaponDomainMaterialImageUrl"',
          'elite_enemy_drop.name AS "eliteEnemyMaterial"',
          'elite_enemy_drop.imageUrl AS "eliteEnemyMaterialImageUrl"',
          'common_enemy_drop.name AS "commonEnemyMaterial"',
          'common_enemy_drop.imageUrl AS "commonEnemyMaterialImageUrl"',
          "weapon.gacha AS gacha",
        ]);
      if (filterType === "id") {
        baseQuery.where("weapon.id = :id", { id: searchValue });
      } else if (filterType === "weaponName") {
        baseQuery.where("weapon.name = :weaponName", {
          weaponName: searchValue,
        });
      } else if (filterType === "weaponType") {
        baseQuery.where("weapon_type.name = :weaponType", {
          weaponType: searchValue,
        });
      }
      const weapons: WeaponData[] = await baseQuery
        .orderBy({ '"weaponName"': "ASC" })
        .getRawMany();
      if (weapons.length > 0) {
        if (weapons.length === 1) {
          // id or name search
          const weaponId = weapons[0].weaponId!.toString();
          const weaponName = weapons[0].weaponName!;
          await Promise.all([
            client.json.set(weaponByIdKey(), "$", {}, { NX: true }),
            client.json.set(weaponByIdKey(), weaponId, weapons, {
              NX: true,
            }),
            client.expireAt(weaponByIdKey(), expireKeyTomorrow(), "NX"),
            client.hSet(weaponNameToIdKey(), weaponName, weaponId),
            client.expireAt(weaponNameToIdKey(), expireKeyTomorrow(), "NX"),
          ]);
        } else {
          // weapon type search
          const weaponType = weapons[0].weaponType!;
          await Promise.all([
            client.json.set(weaponsByTypeKey(), "$", {}, { NX: true }),
            client.json.set(weaponsByTypeKey(), weaponType, weapons, {
              NX: true,
            }),
            client.expireAt(weaponsByTypeKey(), expireKeyTomorrow(), "NX"),
          ]);
        }
      }
      return weapons;
    }
  } catch (err) {
    throw new Error("There was an error querying weapons.");
  }
};

const retrieveRandomWeaponData: () => Promise<WeaponData[]> = async () => {
  const weapons = await retrieveWeaponData();
  const randomIndex = Math.floor(Math.random() * weapons.length);
  const randomWeapon = weapons[randomIndex];
  return [randomWeapon];
};

export {
  retrieveWeaponData,
  retrieveFilteredWeaponData,
  retrieveRandomWeaponData,
};
