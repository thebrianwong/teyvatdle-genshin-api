import { TalentData, TalentDataResolvers } from "../../../generated/graphql";

const talentDataResolvers: TalentDataResolvers<any, TalentData> = {
  talentId: (parent) => parent.talentId,
  talentName: (parent) => parent.talentName,
  talentType: (parent) => parent.talentType,
  talentImageUrl: (parent) => parent.talentImageUrl,
  characterName: (parent) => parent.characterName,
  characterImageUrl: (parent) => parent.characterImageUrl,
};

export default talentDataResolvers;
