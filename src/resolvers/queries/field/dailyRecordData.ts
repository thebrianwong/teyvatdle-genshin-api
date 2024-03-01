import {
  DailyRecordData,
  DailyRecordDataResolvers,
} from "../../../generated/graphql";

const dailyRecordDataResolvers: DailyRecordDataResolvers<any, DailyRecordData> =
  {
    dailyRecordId: (parent) => parent.dailyRecordId,
    characterId: (parent) => parent.characterId,
    characterSolved: (parent) => parent.characterSolved,
    weaponId: (parent) => parent.weaponId,
    weaponSolved: (parent) => parent.weaponSolved,
    talentId: (parent) => parent.talentId,
    talentSolved: (parent) => parent.talentSolved,
    constellationId: (parent) => parent.constellationId,
    constellationSolved: (parent) => parent.constellationSolved,
    foodId: (parent) => parent.foodId,
    foodSolved: (parent) => parent.foodSolved,
  };

export default dailyRecordDataResolvers;
