import { getLocalSpecialties } from "../../../../controllers/localSpecialtyController";
import { LocalSpecialtyData } from "../../../../generated/graphql";

const localSpecialtyDataRootResolvers: () => Promise<
  LocalSpecialtyData[]
> = async () => {
  return getLocalSpecialties();
};

export default localSpecialtyDataRootResolvers;
