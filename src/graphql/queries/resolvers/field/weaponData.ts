import { WeaponData, WeaponDataResolvers } from "../../../../generated/graphql";

const weaponDataResolvers: WeaponDataResolvers<any, WeaponData> = {
  weaponId: (parent) => parent.weaponId,
  weaponName: (parent) => parent.weaponName,
  rarity: (parent) => parent.rarity,
  weaponType: (parent) => parent.weaponType,
  subStat: (parent) => (parent.subStat ? parent.subStat : null),
  weaponImageUrl: (parent) => parent.weaponImageUrl,
  weaponDomainMaterial: (parent) => parent.weaponDomainMaterial,
  weaponDomainMaterialImageUrl: (parent) => parent.weaponDomainMaterialImageUrl,
  eliteEnemyMaterial: (parent) => parent.eliteEnemyMaterial,
  eliteEnemyMaterialImageUrl: (parent) => parent.eliteEnemyMaterialImageUrl,
  commonEnemyMaterial: (parent) => parent.commonEnemyMaterial,
  commonEnemyMaterialImageUrl: (parent) => parent.commonEnemyMaterialImageUrl,
  gacha: (parent) => parent.gacha,
};

export default weaponDataResolvers;
