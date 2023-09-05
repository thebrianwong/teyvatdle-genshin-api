import { TalentType } from "../talentType.type";

type TalentData = {
  talent_id: number;
  talent_name: string;
  talent_type: TalentType;
  talent_image_url: string;
  character_name: string;
  character_image_url: string;
};

export default TalentData;
