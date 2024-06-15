import DataLoader from "dataloader";
import { retrieveTalentDataByCharacterName } from "../../../controllers/talentController";
import { TalentData } from "../../../generated/graphql";

const createTalentDataLoader = () => {
  return new DataLoader(async (names) => {
    const copyNames = [...names] as string[];
    const map = copyNames.reduce(
      (acc: { [key: string]: TalentData[] }, curr) => {
        acc[curr] = [];
        return acc;
      },
      {}
    );
    const rawTalents = await retrieveTalentDataByCharacterName(
      names as string[]
    );
    rawTalents.forEach((talent) => {
      map[talent.characterName!].push(talent);
    });
    const talents = Object.values(map);
    return talents;
  });
};

export default createTalentDataLoader;
