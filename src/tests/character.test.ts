import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import CharacterData from "../types/data/characterData.type";

beforeAll(async () => {
  await configSetup("Character");
});

afterAll(async () => {
  await configTeardown("Character");
});

test("return Foods as JSON", (done) => {
  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect the non-null Character keys/columns are not null", (done) => {
  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            character_id: expect.anything(),
            character_name: expect.anything(),
            gender: expect.anything(),
            height: expect.anything(),
            rarity: expect.anything(),
            element: expect.anything(),
            weapon_type: expect.anything(),
            ascension_stat: expect.anything(),
            character_image_url: expect.anything(),
            local_specialty: expect.anything(),
            local_specialty_image_url: expect.anything(),
            enhancement_material: expect.anything(),
            enhancement_material_image_url: expect.anything(),
            talent_boss_material: expect.anything(),
            talent_boss_material_image_url: expect.anything(),
            talent_book: expect.anything(),
            talent_book_image_url: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect Characters other than Aloy and Traveler to have a Region", (done) => {
  request(app)
    .get("/api/character")
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
      const arrayOfDataObjects: CharacterData[] = res.body;
      const nonAloyTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !aloyAndTravelerNames.includes(character.character_name)
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
    .get("/api/character")
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
      const arrayOfDataObjects: CharacterData[] = res.body;
      const aloyAndTraveler = arrayOfDataObjects.filter((character) =>
        aloyAndTravelerNames.includes(character.character_name)
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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body;
      const nonTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !travelerNames.includes(character.character_name)
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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body;
      const travelerCharacters = arrayOfDataObjects.filter((character) =>
        travelerNames.includes(character.character_name)
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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body;
      const nonTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !travelerNames.includes(character.character_name)
      );
      expect(nonTravelerCharacters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ascension_boss_material: expect.anything(),
            ascension_boss_material_image_url: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect Traveler to have null for ascension boss material", (done) => {
  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body;
      const travelerCharacters = arrayOfDataObjects.filter((character) =>
        travelerNames.includes(character.character_name)
      );
      expect(travelerCharacters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ascension_boss_material: null,
            ascension_boss_material_image_url: null,
          }),
        ])
      );
    })
    .end(done);
});

test("expect Characters other than Traveler to only use one talent book", (done) => {
  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body;
      const nonTravelerCharacters = arrayOfDataObjects.filter(
        (character) => !travelerNames.includes(character.character_name)
      );
      const usesOnlyOneTalentBook = nonTravelerCharacters.every(
        (character) =>
          character.talent_book.length === 1 &&
          character.talent_book_image_url.length === 1
      );
      expect(usesOnlyOneTalentBook).toBe(true);
    })
    .end(done);
});

test("expect Traveler to use 3 talent books", (done) => {
  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const travelerNames = [
        "Traveler (Anemo)",
        "Traveler (Geo)",
        "Traveler (Electro)",
        "Traveler (Dendro)",
      ];
      const arrayOfDataObjects: CharacterData[] = res.body;
      const travelerCharacters = arrayOfDataObjects.filter((character) =>
        travelerNames.includes(character.character_name)
      );
      const usesThreeTalentBooks = travelerCharacters.every(
        (character) =>
          character.talent_book.length === 3 &&
          character.talent_book_image_url.length === 3
      );
      expect(usesThreeTalentBooks).toBe(true);
    })
    .end(done);
});

test("returned Character data has the correct types for values", (done) => {
  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.character_id).toBe("number");
        expect(typeof data.character_name).toBe("string");
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
          data.weapon_type
        );
        expect([
          "Anemo DMG Bonus",
          "ATK",
          "CRIT DMG",
          "CRIT Rate",
          "Cryo DMG Bonus",
          "DEF",
          "Dendro DMG Bonus",
          "Electro DMG Bonus",
          "Elemental Mastery",
          "Energy Recharge",
          "Geo DMG Bonus",
          "Healing Bonus",
          "HP",
          "Hydro DMG Bonus",
          "Physical DMG Bonus",
          "Pyro DMG Bonus",
          null,
        ]).toContain(data.ascension_stat);
        if (data.birthday) {
          // ex: 2020-08-10T00:00:00.000Z
          expect(data.birthday).toMatch(
            /^\d{4}-(0|1)\d-(0|1|2|3)\dT((\d){2}:){2}\d{2}\.\d{3}Z$/
          );
        } else {
          expect(data.birthday).toBeNull();
        }
        expect(typeof data.character_image_url).toBe("string");
        expect(typeof data.local_specialty).toBe("string");
        expect(typeof data.local_specialty_image_url).toBe("string");
        expect(typeof data.enhancement_material).toBe("string");
        expect(typeof data.enhancement_material_image_url).toBe("string");
        if (data.ascension_boss_material) {
          expect(typeof data.ascension_boss_material).toBe("string");
          expect(typeof data.ascension_boss_material_image_url).toBe("string");
        } else {
          expect(data.ascension_boss_material).toBeNull();
          expect(data.ascension_boss_material_image_url).toBeNull();
        }
        expect(typeof data.talent_boss_material).toBe("string");
        expect(typeof data.talent_boss_material_image_url).toBe("string");
        expect(data.talent_book).toBeInstanceOf(Array);
        expect(data.talent_book_image_url).toBeInstanceOf(Array);
      });
    })
    .end(done);
});

test("return the correct number of Characters", (done) => {
  const numOfCharacters = 71;

  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;
      expect(arrayOfDataObjects).toHaveLength(numOfCharacters);
    })
    .end(done);
});

test("return the correct number of Characters based on gender", (done) => {
  const numOfMales = 24;
  const numOfFemales = 43;
  const numOfOthers = 4;

  request(app)
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;
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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;
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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;
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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;

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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;

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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;
      let swordCharacters = 0;
      let claymoreCharacters = 0;
      let polearmCharacters = 0;
      let catalystCharacters = 0;
      let bowCharacters = 0;

      arrayOfDataObjects.forEach((character) => {
        if (character.weapon_type === "Sword") {
          swordCharacters += 1;
        } else if (character.weapon_type === "Claymore") {
          claymoreCharacters += 1;
        } else if (character.weapon_type === "Polearm") {
          polearmCharacters += 1;
        } else if (character.weapon_type === "Catalyst") {
          catalystCharacters += 1;
        } else if (character.weapon_type === "Bow") {
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
    .get("/api/character")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: CharacterData[] = res.body;

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
        if (character.ascension_stat === "Anemo DMG Bonus") {
          anemoDMGCharacters += 1;
        } else if (character.ascension_stat === "ATK") {
          atkCharacters += 1;
        } else if (character.ascension_stat === "CRIT DMG") {
          critDMGCharacters += 1;
        } else if (character.ascension_stat === "CRIT Rate") {
          critRateCharacters += 1;
        } else if (character.ascension_stat === "Cryo DMG Bonus") {
          cryoDMGCharacters += 1;
        } else if (character.ascension_stat === "DEF") {
          defCharacters += 1;
        } else if (character.ascension_stat === "Dendro DMG Bonus") {
          dendroDMGCharacters += 1;
        } else if (character.ascension_stat === "Electro DMG Bonus") {
          electroDMGCharacters += 1;
        } else if (character.ascension_stat === "Elemental Mastery") {
          elementalMasteryCharacters += 1;
        } else if (character.ascension_stat === "Energy Recharge") {
          energyRechargeCharacters += 1;
        } else if (character.ascension_stat === "Geo DMG Bonus") {
          geoDMGCharacters += 1;
        } else if (character.ascension_stat === "Healing Bonus") {
          healingBonusCharacters += 1;
        } else if (character.ascension_stat === "HP") {
          hpCharacters += 1;
        } else if (character.ascension_stat === "Hydro DMG Bonus") {
          hydroDMGCharacters += 1;
        } else if (character.ascension_stat === "Physical DMG Bonus") {
          physicalDMGCharacters += 1;
        } else if (character.ascension_stat === "Pyro DMG Bonus") {
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
