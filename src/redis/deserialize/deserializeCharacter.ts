import { CharacterData } from "../../generated/graphql";

const deserializeCharacter = (
  rawCharacter: CharacterData & { birthday: string }
) => {
  return {
    ...rawCharacter,
    birthday: new Date(rawCharacter.birthday),
  };
};

export { deserializeCharacter };
