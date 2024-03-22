import { WeaponData, WeaponDataResolvers } from "../../../../generated/graphql";

const weaponDataResolvers: WeaponDataResolvers<any, WeaponData> = {
  weaponId: (parent) => parent.weaponId || null,
  weaponName: (parent) => parent.weaponName || null,
  rarity: (parent) => parent.rarity || null,
  weaponType: (parent) => parent.weaponType || null,
  subStat: (parent) => (parent.subStat ? parent.subStat : null),
  weaponImageUrl: (parent) => parent.weaponImageUrl || null,
  weaponDomainMaterial: (parent) => parent.weaponDomainMaterial || null,
  weaponDomainMaterialImageUrl: (parent) =>
    parent.weaponDomainMaterialImageUrl || null,
  eliteEnemyMaterial: (parent) => parent.eliteEnemyMaterial || null,
  eliteEnemyMaterialImageUrl: (parent) =>
    parent.eliteEnemyMaterialImageUrl || null,
  commonEnemyMaterial: (parent) => parent.commonEnemyMaterial || null,
  commonEnemyMaterialImageUrl: (parent) =>
    parent.commonEnemyMaterialImageUrl || null,
  gacha: (parent) => (typeof parent.gacha === "boolean" ? parent.gacha : null),
};

export default weaponDataResolvers;
