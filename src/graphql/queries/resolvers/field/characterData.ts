import { retrieveFilteredConstellationData } from "../../../../controllers/constellationController";
import { retrieveFilteredTalentData } from "../../../../controllers/talentController";
import {
  CharacterData,
  CharacterDataResolvers,
} from "../../../../generated/graphql";

const characterDataResolvers: CharacterDataResolvers<any, CharacterData> = {
  characterId: (parent) => parent.characterId || null,
  characterName: (parent) => parent.characterName || null,
  gender: (parent) => parent.gender || null,
  height: (parent) => parent.height || null,
  rarity: (parent) => parent.rarity || null,
  region: (parent) => (parent.region ? parent.region : null),
  element: (parent) => parent.element || null,
  weaponType: (parent) => parent.weaponType || null,
  ascensionStat: (parent) => parent.ascensionStat || null,
  birthday: (parent) => (parent.birthday ? parent.birthday : null),
  characterImageUrl: (parent) => parent.characterImageUrl || null,
  characterCorrectImageUrl: (parent) => parent.characterCorrectImageUrl || null,
  characterWrongImageUrl: (parent) => parent.characterWrongImageUrl || null,
  localSpecialty: (parent) => parent.localSpecialty || null,
  localSpecialtyImageUrl: (parent) => parent.localSpecialtyImageUrl || null,
  enhancementMaterial: (parent) => parent.enhancementMaterial || null,
  enhancementMaterialImageUrl: (parent) =>
    parent.enhancementMaterialImageUrl || null,
  ascensionBossMaterial: (parent) =>
    parent.ascensionBossMaterial ? parent.ascensionBossMaterial : null,
  ascensionBossMaterialImageUrl: (parent) =>
    parent.ascensionBossMaterialImageUrl
      ? parent.ascensionBossMaterialImageUrl
      : null,
  talentBossMaterial: (parent) => parent.talentBossMaterial || null,
  talentBossMaterialImageUrl: (parent) =>
    parent.talentBossMaterialImageUrl || null,
  talentBook: (parent) => parent.talentBook || null,
  talentBookImageUrl: (parent) => parent.talentBookImageUrl || null,
  talents: async (parent) => {
    return await retrieveFilteredTalentData(
      "characterName",
      parent.characterName!
    );
  },
  constellations: async (parent) => {
    return await retrieveFilteredConstellationData(
      "characterName",
      parent.characterName!
    );
  },
};

export default characterDataResolvers;
