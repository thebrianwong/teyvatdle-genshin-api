import CharacterData from "./characterData.type";
import ConstellationData from "./constellationData.type";
import FoodData from "./foodData.type";
import TalentData from "./talentData.type";
import WeaponData from "./weaponData.type";

type GameData = {
  characterData: CharacterData[];
  weaponData: WeaponData[];
  talentData: TalentData[];
  constellationData: ConstellationData[];
  foodData: FoodData[];
};

export default GameData;
