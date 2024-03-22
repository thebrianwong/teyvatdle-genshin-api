import { TalentData, TalentDataResolvers } from "../../../../generated/graphql";

const talentDataResolvers: TalentDataResolvers<any, TalentData> = {
  talentId: (parent) => parent.talentId || null,
  talentName: (parent) => parent.talentName || null,
  talentType: (parent) => parent.talentType || null,
  talentImageUrl: (parent) => parent.talentImageUrl || null,
  characterName: (parent) => parent.characterName || null,
  characterImageUrl: (parent) => parent.characterImageUrl || null,
};

export default talentDataResolvers;
