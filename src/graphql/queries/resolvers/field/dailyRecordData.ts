import {
  retrieveDailyCharacterData,
  retrieveDailyConstellationData,
  retrieveDailyFoodData,
  retrieveDailyTalentData,
  retrieveDailyWeaponData,
} from "../../../../controllers/teyvatdleGameDataController";
import {
  DailyRecordData,
  DailyRecordDataResolvers,
} from "../../../../generated/graphql";

const dailyRecordDataResolvers: DailyRecordDataResolvers<any, DailyRecordData> =
  {
    dailyRecordId: (parent) => parent.dailyRecordId,
    character: async (parent) => {
      const character = await retrieveDailyCharacterData(parent.dailyRecordId);
      return character;
    },
    characterSolved: (parent) => parent.characterSolved,
    weapon: async (parent) => {
      const weapon = await retrieveDailyWeaponData(parent.dailyRecordId);
      return weapon;
    },
    weaponSolved: (parent) => parent.weaponSolved,
    talent: async (parent) => {
      const talent = await retrieveDailyTalentData(parent.dailyRecordId);
      return talent;
    },
    talentSolved: (parent) => parent.talentSolved,
    constellation: async (parent) => {
      const constellation = await retrieveDailyConstellationData(
        parent.dailyRecordId
      );
      return constellation;
    },
    constellationSolved: (parent) => parent.constellationSolved,
    food: async (parent) => {
      const food = await retrieveDailyFoodData(parent.dailyRecordId);
      return food;
    },
    foodSolved: (parent) => parent.foodSolved,
  };

export default dailyRecordDataResolvers;
