import {
  ConstellationData,
  ConstellationDataResolvers,
} from "../../../../generated/graphql";

const constellationDataResolvers: ConstellationDataResolvers<
  any,
  ConstellationData
> = {
  constellationId: (parent) => parent.constellationId || null,
  constellationName: (parent) => parent.constellationName || null,
  constellationLevel: (parent) => parent.constellationLevel || null,
  constellationImageUrl: (parent) => parent.constellationImageUrl || null,
  characterName: (parent) => parent.characterName || null,
  characterImageUrl: (parent) => parent.characterImageUrl || null,
};

export default constellationDataResolvers;
