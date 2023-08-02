import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Weapon from "../models/weapon.model";

const retrieveWeaponData = async () => {
  const weaponRepo = AppDataSource.getRepository(Weapon);
  const weapons = await weaponRepo
    .createQueryBuilder("weapon")
    .innerJoin("weapon.typeId", "weapon_type")
    .leftJoin("weapon.subStatId", "stat")
    .innerJoin("weapon.weaponDomainMaterialId", "weapon_domain_material")
    .innerJoin("weapon.eliteEnemyMaterialId", "elite_enemy_drop")
    .innerJoin("weapon.commonEnemyMaterialId", "common_enemy_drop")
    .select([
      "weapon.id AS weapon_id",
      "weapon.name AS weapon_name",
      "weapon.rarity AS rarity",
      "weapon_type.name AS weapon_type",
      "stat.name AS sub_stat",
      "weapon.imageUrl AS weapon_image_url",
      "weapon_domain_material.name AS weapon_domain_material",
      "weapon_domain_material.imageUrl AS weapon_domain_material_image_url",
      "elite_enemy_drop.name AS elite_enemy_material",
      "elite_enemy_drop.imageUrl AS elite_enemy_material_image_url",
      "common_enemy_drop.name AS common_enemy_material",
      "common_enemy_drop.imageUrl AS common_enemy_material_image_url",
      "weapon.gacha AS gacha",
    ])
    .orderBy({ weapon_id: "ASC" })
    .getRawMany();
  return weapons;
};

const getWeapons: RequestHandler = async (req, res, next) => {
  const weaponData = await retrieveWeaponData();
  res.send(weaponData);
};

export { getWeapons, retrieveWeaponData };
