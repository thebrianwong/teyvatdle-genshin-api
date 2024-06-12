import { CharacterData } from "../generated/graphql";

const deserializeCharacter = (
  rawCharacter: CharacterData & { birthday: string | null }
) => {
  return {
    ...rawCharacter,
    birthday: rawCharacter.birthday ? new Date(rawCharacter.birthday) : null,
  };
};

export { deserializeCharacter };
