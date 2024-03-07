import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { CharacterData } from "../generated/graphql";

beforeAll(async () => {
  await configSetup("Character");
});

afterAll(async () => {
  await configTeardown("Character");
});

const queryData = {
  query: `query CharacterData {
    characterData {
      characterId
      characterName
      gender
      height
      rarity
      region
      element
      weaponType
      ascensionStat
      birthday
      characterImageUrl
      characterCorrectImageUrl
      characterWrongImageUrl
      localSpecialty
      localSpecialtyImageUrl
      enhancementMaterial
      enhancementMaterialImageUrl
      ascensionBossMaterial
      ascensionBossMaterialImageUrl
      talentBossMaterial
      talentBossMaterialImageUrl
      talentBook
      talentBookImageUrl
    }
  }`,
};

test("return Characters as JSON", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect the non-null Character keys/columns are not null", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            characterId: expect.anything(),
            characterName: expect.anything(),
            gender: expect.anything(),
            height: expect.anything(),
            rarity: expect.anything(),
            element: expect.anything(),
            weaponType: expect.anything(),
            ascensionStat: expect.anything(),
            characterImageUrl: expect.anything(),
            characterCorrectImageUrl: expect.anything(),
            characterWrongImageUrl: expect.anything(),
            localSpecialty: expect.anything(),
            localSpecialtyImageUrl: expect.anything(),
            enhancementMaterial: expect.anything(),
            enhancementMaterialImageUrl: expect.anything(),
            talentBossMaterial: expect.anything(),
            talentBossMaterialImageUrl: expect.anything(),
            talentBook: expect.anything(),
            talentBookImageUrl: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect Characters other than Aloy and Traveler to have a Region", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const aloyAndTravelerNames = [
        "Aloy",
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const nonAloyTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !aloyAndTravelerNames.includes(character.characterName)
      );
      expect(nonAloyTravelerCharacters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            region: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect Aloy and Traveler to have null for Region", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const aloyAndTravelerNames = [
        "Aloy",
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const aloyAndTraveler = arrayOfDataObjects.filter((character) =>
        aloyAndTravelerNames.includes(character.characterName)
      );
      expect(aloyAndTraveler).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            region: null,
          }),
        ])
      );
    })
    .end(done);
});

test("expect Characters other than Traveler to have a birthday", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const nonTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !travelerNames.includes(character.characterName)
      );
      expect(nonTravelerCharacters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            birthday: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect Traveler to have null for birthday", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const travelerCharacters = arrayOfDataObjects.filter((character) =>
        travelerNames.includes(character.characterName)
      );
      expect(travelerCharacters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            birthday: null,
          }),
        ])
      );
    })
    .end(done);
});

test("expect Characters other than Traveler to have ascension boss material", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const nonTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !travelerNames.includes(character.characterName)
      );
      expect(nonTravelerCharacters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ascensionBossMaterial: expect.anything(),
            ascensionBossMaterialImageUrl: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect Traveler to have null for ascension boss material", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const travelerCharacters = arrayOfDataObjects.filter((character) =>
        travelerNames.includes(character.characterName)
      );
      expect(travelerCharacters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ascensionBossMaterial: null,
            ascensionBossMaterialImageUrl: null,
          }),
        ])
      );
    })
    .end(done);
});

test("expect Characters other than Traveler to only use one talent book", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const nonTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !travelerNames.includes(character.characterName)
      );
      const usesOnlyOneTalentBook = nonTravelerCharacters.every(
        (character) =>
          character.talentBook.length === 1 &&
          character.talentBookImageUrl.length === 1
      );
      expect(usesOnlyOneTalentBook).toBe(true);
    })
    .end(done);
});

test("expect Traveler to use 3 talent books", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      const travelerCharacters = arrayOfDataObjects.filter((character) =>
        travelerNames.includes(character.characterName)
      );
      const usesThreeTalentBooks = travelerCharacters.every(
        (character) =>
          character.talentBook.length === 3 &&
          character.talentBookImageUrl.length === 3
      );
      expect(usesThreeTalentBooks).toBe(true);
    })
    .end(done);
});

test("returned Character data has the correct types for values", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.characterId).toBe("string");
        expect(typeof data.characterName).toBe("string");
        expect(["Male", "Female", "Other"]).toContain(data.gender);
        expect(["Short", "Medium", "Tall"]).toContain(data.height);
        expect(typeof data.rarity).toBe("number");
        expect([
          "Mondstadt",
          "Liyue",
          "Inazuma",
          "Sumeru",
          "Fontaine",
          "Natlan",
          "Snezhnaya",
          null,
        ]).toContain(data.region);
        expect([
          "Anemo",
          "Geo",
          "Electro",
          "Dendro",
          "Hydro",
          "Pyro",
          "Cryo",
        ]).toContain(data.element);
        expect(["Sword", "Claymore", "Polearm", "Catalyst", "Bow"]).toContain(
          data.weaponType
        );
        expect([
          "Anemo_DMG_Bonus",
          "ATK",
          "CRIT_DMG",
          "CRIT_Rate",
          "Cryo_DMG_Bonus",
          "DEF",
          "Dendro_DMG_Bonus",
          "Electro_DMG_Bonus",
          "Elemental_Mastery",
          "Energy_Recharge",
          "Geo_DMG_Bonus",
          "Healing_Bonus",
          "HP",
          "Hydro_DMG_Bonus",
          "Physical_DMG_Bonus",
          "Pyro_DMG_Bonus",
          null,
        ]).toContain(data.ascensionStat);
        if (data.birthday) {
          // ex: 2020-08-10T00:00:00.000Z
          // expect(data.birthday).toMatch(
          //   /^\d{4}-(0|1)\d-(0|1|2|3)\dT((\d){2}:){2}\d{2}\.\d{3}Z$/
          // );
          expect(typeof data.birthday).toBe("number");
        } else {
          expect(data.birthday).toBeNull();
        }
        expect(typeof data.characterImageUrl).toBe("string");
        expect(typeof data.characterCorrectImageUrl).toBe("string");
        expect(typeof data.characterWrongImageUrl).toBe("string");
        expect(typeof data.localSpecialty).toBe("string");
        expect(typeof data.localSpecialtyImageUrl).toBe("string");
        expect(typeof data.enhancementMaterial).toBe("string");
        expect(typeof data.enhancementMaterialImageUrl).toBe("string");
        if (data.ascensionBossMaterial) {
          expect(typeof data.ascensionBossMaterial).toBe("string");
          expect(typeof data.ascensionBossMaterialImageUrl).toBe("string");
        } else {
          expect(data.ascensionBossMaterial).toBeNull();
          expect(data.ascensionBossMaterialImageUrl).toBeNull();
        }
        expect(typeof data.talentBossMaterial).toBe("string");
        expect(typeof data.talentBossMaterialImageUrl).toBe("string");
        expect(data.talentBook).toBeInstanceOf(Array);
        expect(data.talentBookImageUrl).toBeInstanceOf(Array);
      });
    })
    .end(done);
});

test("return the correct number of Characters", (done) => {
  const numOfCharacters = 71;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      expect(arrayOfDataObjects).toHaveLength(numOfCharacters);
    })
    .end(done);
});

test("return the correct number of Characters based on gender", (done) => {
  const numOfMales = 24;
  const numOfFemales = 43;
  const numOfOthers = 4;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      let maleCharacters = 0;
      let femaleCharacters = 0;
      let otherCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.gender === "Male") {
          maleCharacters += 1;
        } else if (character.gender === "Female") {
          femaleCharacters += 1;
        } else if (character.gender === "Other") {
          otherCharacters += 1;
        }
      });

      expect(maleCharacters).toBe(numOfMales);
      expect(femaleCharacters).toBe(numOfFemales);
      expect(otherCharacters).toBe(numOfOthers);
    })
    .end(done);
});

test("return the correct number of Characters based on height", (done) => {
  const numOfShorts = 7;
  const numOfMediums = 41;
  const numOfTalls = 23;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      let shortCharacters = 0;
      let mediumCharacters = 0;
      let tallCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.height === "Short") {
          shortCharacters += 1;
        } else if (character.height === "Medium") {
          mediumCharacters += 1;
        } else if (character.height === "Tall") {
          tallCharacters += 1;
        }
      });

      expect(shortCharacters).toBe(numOfShorts);
      expect(mediumCharacters).toBe(numOfMediums);
      expect(tallCharacters).toBe(numOfTalls);
    })
    .end(done);
});

test("return the correct number of Characters based on rarity", (done) => {
  const numOfFourStars = 35;
  const numOfFiveStars = 36;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      let fourStarCharacters = 0;
      let fiveStartCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.rarity === 4) {
          fourStarCharacters += 1;
        } else if (character.rarity === 5) {
          fiveStartCharacters += 1;
        }
      });

      expect(fourStarCharacters).toBe(numOfFourStars);
      expect(fiveStartCharacters).toBe(numOfFiveStars);
    })
    .end(done);
});

test("return the correct number of Characters based on Region", (done) => {
  const numOfMondstadtCharacters = 19;
  const numOfLiyueCharacters = 18;
  const numOfInazumaCharacters = 15;
  const numOfSumeruCharacters = 13;
  const numOfFontaineCharacters = 0;
  const numOfNatlanCharacters = 0;
  const numOfSnezhnayaCharacters = 1;
  const numOfNoRegionCharacters = 5;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;

      let mondstadtCharacters = 0;
      let liyueCharacters = 0;
      let inazumaCharacters = 0;
      let sumeruCharacters = 0;
      let fontaineCharacters = 0;
      let natlanCharacters = 0;
      let snezhnayaCharacters = 0;
      let noRegionCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.region === "Mondstadt") {
          mondstadtCharacters += 1;
        } else if (character.region === "Liyue") {
          liyueCharacters += 1;
        } else if (character.region === "Inazuma") {
          inazumaCharacters += 1;
        } else if (character.region === "Sumeru") {
          sumeruCharacters += 1;
        } else if (character.region === "Fontaine") {
          fontaineCharacters += 1;
        } else if (character.region === "Natlan") {
          natlanCharacters += 1;
        } else if (character.region === "Snezhnaya") {
          snezhnayaCharacters += 1;
        } else if (character.region === null) {
          noRegionCharacters += 1;
        }
      });

      expect(mondstadtCharacters).toBe(numOfMondstadtCharacters);
      expect(liyueCharacters).toBe(numOfLiyueCharacters);
      expect(inazumaCharacters).toBe(numOfInazumaCharacters);
      expect(sumeruCharacters).toBe(numOfSumeruCharacters);
      expect(fontaineCharacters).toBe(numOfFontaineCharacters);
      expect(natlanCharacters).toBe(numOfNatlanCharacters);
      expect(snezhnayaCharacters).toBe(numOfSnezhnayaCharacters);
      expect(noRegionCharacters).toBe(numOfNoRegionCharacters);
    })
    .end(done);
});

test("return the correct number of Characters based on GenshinElement", (done) => {
  const numOfAnemoCharacters = 10;
  const numOfGeoCharacters = 8;
  const numOfElectroCharacters = 12;
  const numOfDendroCharacters = 9;
  const numOfHydroCharacters = 9;
  const numOfPyroCharacters = 11;
  const numOfCryoCharacters = 12;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;

      let anemoCharacters = 0;
      let geoCharacters = 0;
      let electroCharacters = 0;
      let dendroCharacters = 0;
      let hydroCharacters = 0;
      let pyroCharacters = 0;
      let cryoCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.element === "Anemo") {
          anemoCharacters += 1;
        } else if (character.element === "Geo") {
          geoCharacters += 1;
        } else if (character.element === "Electro") {
          electroCharacters += 1;
        } else if (character.element === "Dendro") {
          dendroCharacters += 1;
        } else if (character.element === "Hydro") {
          hydroCharacters += 1;
        } else if (character.element === "Pyro") {
          pyroCharacters += 1;
        } else if (character.element === "Cryo") {
          cryoCharacters += 1;
        }
      });

      expect(anemoCharacters).toBe(numOfAnemoCharacters);
      expect(geoCharacters).toBe(numOfGeoCharacters);
      expect(electroCharacters).toBe(numOfElectroCharacters);
      expect(dendroCharacters).toBe(numOfDendroCharacters);
      expect(hydroCharacters).toBe(numOfHydroCharacters);
      expect(pyroCharacters).toBe(numOfPyroCharacters);
      expect(cryoCharacters).toBe(numOfCryoCharacters);
    })
    .end(done);
});

test("return the correct number of Characters based on weapon type", (done) => {
  const numOfSwordCharacters = 19;
  const numOfClaymoreCharacters = 12;
  const numOfPolearmCharacters = 13;
  const numOfCatalystCharacters = 13;
  const numOfBowCharacters = 14;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;
      let swordCharacters = 0;
      let claymoreCharacters = 0;
      let polearmCharacters = 0;
      let catalystCharacters = 0;
      let bowCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.weaponType === "Sword") {
          swordCharacters += 1;
        } else if (character.weaponType === "Claymore") {
          claymoreCharacters += 1;
        } else if (character.weaponType === "Polearm") {
          polearmCharacters += 1;
        } else if (character.weaponType === "Catalyst") {
          catalystCharacters += 1;
        } else if (character.weaponType === "Bow") {
          bowCharacters += 1;
        }
      });

      expect(swordCharacters).toBe(numOfSwordCharacters);
      expect(claymoreCharacters).toBe(numOfClaymoreCharacters);
      expect(polearmCharacters).toBe(numOfPolearmCharacters);
      expect(catalystCharacters).toBe(numOfCatalystCharacters);
      expect(bowCharacters).toBe(numOfBowCharacters);
    })
    .end(done);
});

test("return the correct number of Characters based on sub stat", (done) => {
  const numOfAnemoDMGCharacters = 2;
  const numofATKCharacters = 15;
  const numOfCritDMGCharacters = 7;
  const numOfCritRateCharacters = 7;
  const numOfCryoDMGCharacters = 2;
  const numOfDEFCharacters = 1;
  const numOfDendroDMGCharacters = 2;
  const numOfElectroDMGCharacters = 1;
  const numOfElementalMasteryCharacters = 6;
  const numOfEnergyRechargeCharacters = 6;
  const numOfGeoDMGCharacters = 4;
  const numOfHealingBonusCharacters = 2;
  const numOfHPCharacters = 11;
  const numOfHydroDMGCharacters = 2;
  const numOfPhysicalDMGCharacters = 1;
  const numOfPyroDMGCharacters = 2;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body.data.characterData;

      let anemoDMGCharacters = 0;
      let atkCharacters = 0;
      let critDMGCharacters = 0;
      let critRateCharacters = 0;
      let cryoDMGCharacters = 0;
      let defCharacters = 0;
      let dendroDMGCharacters = 0;
      let electroDMGCharacters = 0;
      let elementalMasteryCharacters = 0;
      let energyRechargeCharacters = 0;
      let geoDMGCharacters = 0;
      let healingBonusCharacters = 0;
      let hpCharacters = 0;
      let hydroDMGCharacters = 0;
      let physicalDMGCharacters = 0;
      let pyroDMGCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.ascensionStat === "Anemo_DMG_Bonus") {
          anemoDMGCharacters += 1;
        } else if (character.ascensionStat === "ATK") {
          atkCharacters += 1;
        } else if (character.ascensionStat === "CRIT_DMG") {
          critDMGCharacters += 1;
        } else if (character.ascensionStat === "CRIT_Rate") {
          critRateCharacters += 1;
        } else if (character.ascensionStat === "Cryo_DMG_Bonus") {
          cryoDMGCharacters += 1;
        } else if (character.ascensionStat === "DEF") {
          defCharacters += 1;
        } else if (character.ascensionStat === "Dendro_DMG_Bonus") {
          dendroDMGCharacters += 1;
        } else if (character.ascensionStat === "Electro_DMG_Bonus") {
          electroDMGCharacters += 1;
        } else if (character.ascensionStat === "Elemental_Mastery") {
          elementalMasteryCharacters += 1;
        } else if (character.ascensionStat === "Energy_Recharge") {
          energyRechargeCharacters += 1;
        } else if (character.ascensionStat === "Geo_DMG_Bonus") {
          geoDMGCharacters += 1;
        } else if (character.ascensionStat === "Healing_Bonus") {
          healingBonusCharacters += 1;
        } else if (character.ascensionStat === "HP") {
          hpCharacters += 1;
        } else if (character.ascensionStat === "Hydro_DMG_Bonus") {
          hydroDMGCharacters += 1;
        } else if (character.ascensionStat === "Physical_DMG_Bonus") {
          physicalDMGCharacters += 1;
        } else if (character.ascensionStat === "Pyro_DMG_Bonus") {
          pyroDMGCharacters += 1;
        }
      });

      expect(anemoDMGCharacters).toBe(numOfAnemoDMGCharacters);
      expect(atkCharacters).toBe(numofATKCharacters);
      expect(critDMGCharacters).toBe(numOfCritDMGCharacters);
      expect(critRateCharacters).toBe(numOfCritRateCharacters);
      expect(cryoDMGCharacters).toBe(numOfCryoDMGCharacters);
      expect(defCharacters).toBe(numOfDEFCharacters);
      expect(dendroDMGCharacters).toBe(numOfDendroDMGCharacters);
      expect(electroDMGCharacters).toBe(numOfElectroDMGCharacters);
      expect(elementalMasteryCharacters).toBe(numOfElementalMasteryCharacters);
      expect(energyRechargeCharacters).toBe(numOfEnergyRechargeCharacters);
      expect(geoDMGCharacters).toBe(numOfGeoDMGCharacters);
      expect(healingBonusCharacters).toBe(numOfHealingBonusCharacters);
      expect(hpCharacters).toBe(numOfHPCharacters);
      expect(hydroDMGCharacters).toBe(numOfHydroDMGCharacters);
      expect(physicalDMGCharacters).toBe(numOfPhysicalDMGCharacters);
      expect(pyroDMGCharacters).toBe(numOfPyroDMGCharacters);
    })
    .end(done);
});

describe("Character query argument test suite", () => {
  test("a null filter argument returns an error", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: null) {
          characterId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;

        expect(data).toBeNull();
        expect(errors[0].message).toBe("Please enter a filter value.");
      })
      .end(done);
  });

  test("if multiple null arguments are provided, return an error", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: { id: null, characterName: null, random: null }) {
          characterId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;
        console.log(response);

        expect(data).toBeNull();
        expect(errors[0].message).toBe("Please enter a single filter value.");
      })
      .end(done);
  });

  test("if multiple valid arguments are provided, return an error", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: { id: "1", characterName: "Amber", random: true }) {
          characterId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;
        console.log(response);

        expect(data).toBeNull();
        expect(errors[0].message).toBe("Please enter a single filter value.");
      })
      .end(done);
  });

  describe("a null argument returns an error", () => {
    test("id", (done) => {
      const queryData = {
        query: `query CharacterData {
          characterData(filter: {id: null}) {
            characterId
          }
        }`,
      };

      request(app)
        .post("/graphql")
        .send(queryData)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          const response = res.body;
          const data = response.data;
          const errors = response.errors;

          expect(data).toBeNull();
          expect(errors[0].message).toBe(
            "Invalid argument. Please enter an id."
          );
        })
        .end(done);
    });

    test("characterName", (done) => {
      const queryData = {
        query: `query CharacterData {
          characterData(filter: {characterName: null}) {
            characterId
          }
        }`,
      };

      request(app)
        .post("/graphql")
        .send(queryData)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          const response = res.body;
          const data = response.data;
          const errors = response.errors;

          expect(data).toBeNull();
          expect(errors[0].message).toBe(
            "Invalid argument. Please enter a character name."
          );
        })
        .end(done);
    });

    test("random", (done) => {
      const queryData = {
        query: `query CharacterData {
          characterData(filter: {random: null}) {
            characterId
          }
        }`,
      };

      request(app)
        .post("/graphql")
        .send(queryData)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          const response = res.body;
          const data = response.data;
          const errors = response.errors;

          expect(data).toBeNull();
          expect(errors[0].message).toBe(
            'Invalid argument. Please set the argument "random" to "true" or "false".'
          );
        })
        .end(done);
    });
  });

  test("a non-number id returns an error", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: {id: "hello"}) {
          characterId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;

        expect(data).toBeNull();
        expect(errors[0].message).toBe(
          "Invalid argument. Please enter a number."
        );
      })
      .end(done);
  });

  test("if the Character ID exists, return the Character", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: {id: "1"}) {
          characterId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const character = response.data.characterData[0];

        expect(character).toHaveProperty("characterId", "1");
      })
      .end(done);
  });

  test("if the Character ID does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: {id: "14347"}) {
          characterId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const emptyArray = response.data.characterData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the Character name exists, return the Character", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: {characterName: "Amber"}) {
          characterName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const character = response.data.characterData[0];

        expect(character).toHaveProperty("characterName", "Amber");
      })
      .end(done);
  });

  test("if the Character name does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: {characterName: "Paimon"}) {
          characterName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const emptyArray = response.data.characterData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the random argument is set to true, return a random Character", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: {random: true}) {
          characterName
        }
      }`,
    };

    const mathRandomSpy = jest.spyOn(Math, "random").mockImplementation(() => {
      return 0;
    });

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const character = response.data.characterData[0];

        expect(character).toHaveProperty("characterName", "Albedo");
        mathRandomSpy.mockRestore();
      })
      .end(done);
  });

  test("if the random argument is set to false, return Character data as if no argument was provided", (done) => {
    const queryData = {
      query: `query CharacterData {
        characterData(filter: {random: false}) {
          characterName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const characters = response.data.characterData;

        expect(characters.length).toBeGreaterThan(1);
      })
      .end(done);
  });
});
