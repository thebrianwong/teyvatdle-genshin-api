import { RequestHandler } from "express";
import { AppDataSource } from "../index";
import Weapon from "../models/weapon.model";

const getWeapons: RequestHandler = async (req, res, next) => {
  const weaponRepo = AppDataSource.getRepository(Weapon);
  const weapons = await weaponRepo
    .createQueryBuilder("weapon")
    .innerJoin("weapon.typeId", "weapon_type")
    .leftJoin("weapon.subStatId", "stat")
    .innerJoin("weapon.weaponDomainMaterialId", "weapon_domain_material")
    .innerJoin("weapon.eliteEnemyMaterialId", "elite_enemy_drop")
    .innerJoin("weapon.commonEnemyMaterialId", "common_enemy_drop")
    .select([
      "weapon.name AS weapon_name",
      "weapon.rarity AS rarity",
      "weapon_type.name AS weapon_type",
      "stat.name AS sub_stat",
      "weapon_domain_material.name AS weapon_domain_material",
      "elite_enemy_drop.name AS elite_enemy_material",
      "common_enemy_drop.name AS common_enemy_material",
      "weapon.gacha AS gacha",
      "weapon.imageUrl AS image_url",
    ])
    .getRawMany();
  res.send(weapons);
};

export { getWeapons };
