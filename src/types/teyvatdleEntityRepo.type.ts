import { Repository } from "typeorm";
import Character from "../models/character.model";
import Weapon from "../models/weapon.model";
import Talent from "../models/talent.model";
import Constellation from "../models/constellation.model";
import Food from "../models/food.model";

type TeyvatdleEntityRepo =
  | Repository<Character>
  | Repository<Weapon>
  | Repository<Talent>
  | Repository<Constellation>
  | Repository<Food>;

export default TeyvatdleEntityRepo;
