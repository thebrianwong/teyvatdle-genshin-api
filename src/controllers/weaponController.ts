import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Weapon from "../models/weapon.model";
// import WeaponData from "../types//data/weaponData.type";
import { WeaponData } from "../generated/graphql";

const retrieveWeaponData: () => Promise<WeaponData[]> = async () => {
  const weaponRepo = AppDataSource.getRepository(Weapon);
  try {
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
    return weapons;
  } catch (err) {
    throw new Error("There was an error querying weapons.");
  }
};

const getWeapons: RequestHandler = async (req, res, next) => {
  const weaponData = await retrieveWeaponData();
  res.send(weaponData);
};

export { getWeapons, retrieveWeaponData };
