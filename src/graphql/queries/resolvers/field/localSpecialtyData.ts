import {
  LocalSpecialtyData,
  LocalSpecialtyDataResolvers,
} from "../../../../generated/graphql";

const localSpecialtyDataResolvers: LocalSpecialtyDataResolvers<
  any,
  LocalSpecialtyData
> = {
  localSpecialty: (parent) => parent.localSpecialty,
  region: (parent) => parent.region,
  imageUrl: (parent) => parent.imageUrl,
};

export default localSpecialtyDataResolvers;
