import { AppDataSource, client } from "../index";
import Weapon from "../models/weapon.model";
import { WeaponData } from "../generated/graphql";
import { weaponsKey } from "../redis/keys";
import { expireKeyTomorrow } from "../redis/expireKeyTomorrow";

const retrieveWeaponData: () => Promise<WeaponData[]> = async () => {
  const weaponRepo = AppDataSource.getRepository(Weapon);
  try {
    const cachedWeapons = await client.json.get(weaponsKey());
    if (cachedWeapons) {
      return cachedWeapons as WeaponData[];
    } else {
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
        await client.json.set(weaponsKey(), "$", weapons),
        await client.expireAt(weaponsKey(), expireKeyTomorrow(), "NX"),
      ]);
      return weapons;
    }
  } catch (err) {
    throw new Error("There was an error querying weapons.");
  }
};

const retrieveFilteredWeaponData: (
  filterType: "id" | "weaponName" | "weaponType",
  searchValue: String
) => Promise<WeaponData[]> = async (filterType, searchValue) => {
  const weaponRepo = AppDataSource.getRepository(Weapon);
  try {
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
      baseQuery.where("weapon.name = :weaponName", { weaponName: searchValue });
    } else if (filterType === "weaponType") {
      baseQuery.where("weapon_type.name = :weaponType", {
        weaponType: searchValue,
      });
    }
    const weapons: WeaponData[] = await baseQuery
      .orderBy({ '"weaponName"': "ASC" })
      .getRawMany();
    return weapons;
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
