import DataLoader from "dataloader";
import { ConstellationData } from "../../../generated/graphql";
import { retrieveConstellationDataByCharacterNames } from "../../../controllers/constellationController";

const createConstellationDataLoader = () => {
  return new DataLoader(async (names) => {
    const copyNames = [...names] as string[];
    const map = copyNames.reduce(
      (acc: { [key: string]: ConstellationData[] }, curr) => {
        acc[curr] = [];
        return acc;
      },
      {}
    );
    const rawConstellations = await retrieveConstellationDataByCharacterNames(
      names as string[]
    );
    rawConstellations.forEach((constellation) => {
      map[constellation.characterName!].push(constellation);
    });
    const constellations = Object.values(map);
    return constellations;
  });
};

export default createConstellationDataLoader;
