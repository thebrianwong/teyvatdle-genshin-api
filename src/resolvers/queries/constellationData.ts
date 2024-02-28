import {
  ConstellationData,
  ConstellationDataResolvers,
} from "../../generated/graphql";

const constellationDataResolvers: ConstellationDataResolvers<
  any,
  ConstellationData
> = {
  constellationId: (parent) => parent.constellationId,
  constellationName: (parent) => parent.constellationName,
  constellationLevel: (parent) => parent.constellationLevel,
  constellationImageUrl: (parent) => parent.constellationImageUrl,
  characterName: (parent) => parent.characterName,
  characterImageUrl: (parent) => parent.characterImageUrl,
};

export default constellationDataResolvers;
