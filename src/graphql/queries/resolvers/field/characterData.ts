import { retrieveSingleCharacterData } from "../../../../controllers/characterController";
import { retrieveFilteredConstellationData } from "../../../../controllers/constellationController";
import { retrieveFilteredTalentData } from "../../../../controllers/talentController";
import {
  CharacterData,
  CharacterDataResolvers,
} from "../../../../generated/graphql";

const characterDataResolvers: CharacterDataResolvers<any, CharacterData> = {
  characterId: (parent) => parent.characterId,
  characterName: (parent) => parent.characterName,
  gender: (parent) => parent.gender,
  height: (parent) => parent.height,
  rarity: (parent) => parent.rarity,
  region: (parent) => (parent.region ? parent.region : null),
  element: (parent) => parent.element,
  weaponType: (parent) => parent.weaponType,
  ascensionStat: (parent) => parent.ascensionStat,
  birthday: (parent) => (parent.birthday ? parent.birthday : null),
  characterImageUrl: (parent) => parent.characterImageUrl,
  characterCorrectImageUrl: (parent) => parent.characterCorrectImageUrl,
  characterWrongImageUrl: (parent) => parent.characterWrongImageUrl,
  localSpecialty: (parent) => parent.localSpecialty,
  localSpecialtyImageUrl: (parent) => parent.localSpecialtyImageUrl,
  enhancementMaterial: (parent) => parent.enhancementMaterial,
  enhancementMaterialImageUrl: (parent) => parent.enhancementMaterialImageUrl,
  ascensionBossMaterial: (parent) =>
    parent.ascensionBossMaterial ? parent.ascensionBossMaterial : null,
  ascensionBossMaterialImageUrl: (parent) =>
    parent.ascensionBossMaterialImageUrl
      ? parent.ascensionBossMaterialImageUrl
      : null,
  talentBossMaterial: (parent) => parent.talentBossMaterial,
  talentBossMaterialImageUrl: (parent) => parent.talentBossMaterialImageUrl,
  talentBook: (parent) => parent.talentBook,
  talentBookImageUrl: (parent) => parent.talentBookImageUrl,
  talents: async (parent) => {
    return await retrieveFilteredTalentData(
      "characterName",
      parent.characterName
    );
  },
  constellations: async (parent) => {
    return await retrieveFilteredConstellationData(
      "characterName",
      parent.characterName
    );
  },
};

export default characterDataResolvers;
