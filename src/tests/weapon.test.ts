import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { WeaponData } from "../generated/graphql";

beforeAll(async () => {
  await configSetup("Weapon");
});

afterAll(async () => {
  await configTeardown("Weapon");
});

const queryData = {
  query: `query WeaponData {
    weaponData {
      weaponId
      weaponName
      rarity
      weaponType
      subStat
      weaponImageUrl
      weaponDomainMaterial
      weaponDomainMaterialImageUrl
      eliteEnemyMaterial
      eliteEnemyMaterialImageUrl
      commonEnemyMaterial
      commonEnemyMaterialImageUrl
      gacha
    }
  }`,
};

test("return Weapons as JSON", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Weapon keys/columns (except Sub Stat) are null", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      const oneAndTwoStarWeapons = arrayOfDataObjects.filter(
        (weapon) => weapon.rarity !== 1 && weapon.rarity !== 2
      );
      expect(oneAndTwoStarWeapons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            weaponId: expect.anything(),
            weaponName: expect.anything(),
            rarity: expect.anything(),
            weaponType: expect.anything(),
            subStat: expect.anything(),
            weaponImageUrl: expect.anything(),
            weaponDomainMaterial: expect.anything(),
            weaponDomainMaterialImageUrl: expect.anything(),
            eliteEnemyMaterial: expect.anything(),
            eliteEnemyMaterialImageUrl: expect.anything(),
            commonEnemyMaterial: expect.anything(),
            commonEnemyMaterialImageUrl: expect.anything(),
            gacha: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect 1 and 2 star weapons have null Sub Stats", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      const oneAndTwoStarWeapons = arrayOfDataObjects.filter(
        (weapon) => weapon.rarity === 1 || weapon.rarity === 2
      );
      expect(oneAndTwoStarWeapons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            subStat: null,
          }),
        ])
      );
    })
    .end(done);
});

test("returned Weapon data has the correct types for values", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.weaponId).toBe("string");
        expect(typeof data.weaponName).toBe("string");
        expect(typeof data.rarity).toBe("number");
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
        ]).toContain(data.subStat);
        expect(typeof data.weaponImageUrl).toBe("string");
        expect(typeof data.weaponDomainMaterial).toBe("string");
        expect(typeof data.weaponDomainMaterialImageUrl).toBe("string");
        expect(typeof data.eliteEnemyMaterial).toBe("string");
        expect(typeof data.eliteEnemyMaterialImageUrl).toBe("string");
        expect(typeof data.commonEnemyMaterial).toBe("string");
        expect(typeof data.commonEnemyMaterialImageUrl).toBe("string");
        expect(typeof data.gacha).toBe("boolean");
      });
    })
    .end(done);
});

test("return the correct number of Weapons", (done) => {
  const numOfWeapons = 155;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;

      expect(arrayOfDataObjects).toHaveLength(numOfWeapons);
    })
    .end(done);
});

test("return the correct number of Weapons based on rarity", (done) => {
  const numOfOneStarWeapons = 5;
  const numOfTwoStarWeapons = 5;
  const numOfThreeStarWeapons = 24;
  const numOfFourStarWeapons = 84;
  const numOfFiveStarWeapons = 37;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      let oneStarWeapons = 0;
      let twoStarWeapons = 0;
      let threeStarWeapons = 0;
      let fourStarWeapons = 0;
      let fiveStarWeapons = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.rarity === 1) {
          oneStarWeapons += 1;
        } else if (weapon.rarity === 2) {
          twoStarWeapons += 1;
        } else if (weapon.rarity === 3) {
          threeStarWeapons += 1;
        } else if (weapon.rarity === 4) {
          fourStarWeapons += 1;
        } else if (weapon.rarity === 5) {
          fiveStarWeapons += 1;
        }
      });

      expect(oneStarWeapons).toBe(numOfOneStarWeapons);
      expect(twoStarWeapons).toBe(numOfTwoStarWeapons);
      expect(threeStarWeapons).toBe(numOfThreeStarWeapons);
      expect(fourStarWeapons).toBe(numOfFourStarWeapons);
      expect(fiveStarWeapons).toBe(numOfFiveStarWeapons);
    })
    .end(done);
});

test("return the correct number of Weapons based on weapon type", (done) => {
  const numOfSwords = 35;
  const numOfClaymores = 30;
  const numOfPolearms = 26;
  const numOfCatalysts = 31;
  const numOfBows = 33;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      let swords = 0;
      let claymores = 0;
      let polearms = 0;
      let catalysts = 0;
      let bows = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.weaponType === "Sword") {
          swords += 1;
        } else if (weapon.weaponType === "Claymore") {
          claymores += 1;
        } else if (weapon.weaponType === "Polearm") {
          polearms += 1;
        } else if (weapon.weaponType === "Catalyst") {
          catalysts += 1;
        } else if (weapon.weaponType === "Bow") {
          bows += 1;
        }
      });

      expect(swords).toBe(numOfSwords);
      expect(claymores).toBe(numOfClaymores);
      expect(polearms).toBe(numOfPolearms);
      expect(catalysts).toBe(numOfCatalysts);
      expect(bows).toBe(numOfBows);
    })
    .end(done);
});

test("return the correct number of Weapons based on sub stat", (done) => {
  const numOfATKWeapons = 41;
  const numOfCritDMGWeapons = 17;
  const numOfCritRateWeapons = 17;
  const numOfDEFWeapons = 4;
  const numOfElementalMasteryWeapons = 22;
  const numOfEnergyRechargeWeapons = 26;
  const numOfHPWeapons = 9;
  const numOfPhysicalDMGWeapons = 9;
  const numOfNoSubStatWeapons = 10;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      let atkWeapons = 0;
      let critDMGWeapons = 0;
      let critRateWeapons = 0;
      let defWeapons = 0;
      let elementalMasteryWeapons = 0;
      let energyRechargeWeapons = 0;
      let hpWeapons = 0;
      let physicalDMGWeapons = 0;
      let noSubStatWeapons = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.subStat === "ATK") {
          atkWeapons += 1;
        } else if (weapon.subStat === "CRIT_DMG") {
          critDMGWeapons += 1;
        } else if (weapon.subStat === "CRIT_Rate") {
          critRateWeapons += 1;
        } else if (weapon.subStat === "DEF") {
          defWeapons += 1;
        } else if (weapon.subStat === "Elemental_Mastery") {
          elementalMasteryWeapons += 1;
        } else if (weapon.subStat === "Energy_Recharge") {
          energyRechargeWeapons += 1;
        } else if (weapon.subStat === "HP") {
          hpWeapons += 1;
        } else if (weapon.subStat === "Physical_DMG_Bonus") {
          physicalDMGWeapons += 1;
        } else if (weapon.subStat === null) {
          noSubStatWeapons += 1;
        }
      });

      expect(atkWeapons).toBe(numOfATKWeapons);
      expect(critDMGWeapons).toBe(numOfCritDMGWeapons);
      expect(critRateWeapons).toBe(numOfCritRateWeapons);
      expect(defWeapons).toBe(numOfDEFWeapons);
      expect(elementalMasteryWeapons).toBe(numOfElementalMasteryWeapons);
      expect(energyRechargeWeapons).toBe(numOfEnergyRechargeWeapons);
      expect(hpWeapons).toBe(numOfHPWeapons);
      expect(physicalDMGWeapons).toBe(numOfPhysicalDMGWeapons);
      expect(noSubStatWeapons).toBe(numOfNoSubStatWeapons);
    })
    .end(done);
});

test("return the correct number of Weapons based on weapon domain material", (done) => {
  const numOfAerosideriteWeapons = 15;
  const numOfTeethWeapons = 24;
  const numOfBranchesWeapons = 6;
  const numOfTilesWeapons = 21;
  const numOfElixirsWeapons = 17;
  const numOfShacklesWeapons = 23;
  const numOfPillarsWeapons = 17;
  const numOfMagatamasWeapons = 8;
  const numOfGardensWeapons = 5;
  const numOfOniWeapons = 7;
  const numOfMightsWeapons = 6;
  const numOfTalismansWeapons = 6;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      let aerosideriteWeapons = 0;
      let teethWeapons = 0;
      let branchesWeapons = 0;
      let tilesWeapons = 0;
      let elixirsWeapons = 0;
      let shacklesWeapons = 0;
      let pillarsWeapons = 0;
      let magatamasWeapons = 0;
      let gardensWeapons = 0;
      let oniWeapons = 0;
      let mightsWeapons = 0;
      let talismansWeapons = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.weaponDomainMaterial === "Aerosiderite") {
          aerosideriteWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Boreal Wolf Teeth") {
          teethWeapons += 1;
        } else if (
          weapon.weaponDomainMaterial === "Branches of a Distant Sea"
        ) {
          branchesWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Decarabian Tiles") {
          tilesWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Elixirs") {
          elixirsWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Gladiator Shackles") {
          shacklesWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Guyun Pillars") {
          pillarsWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Narukami's Magatamas") {
          magatamasWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Oasis Gardens") {
          gardensWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Oni Masks") {
          oniWeapons += 1;
        } else if (weapon.weaponDomainMaterial === "Scorching Mights") {
          mightsWeapons += 1;
        } else if (
          weapon.weaponDomainMaterial === "Talismans of the Forest Dew"
        ) {
          talismansWeapons += 1;
        }
      });

      expect(aerosideriteWeapons).toBe(numOfAerosideriteWeapons);
      expect(teethWeapons).toBe(numOfTeethWeapons);
      expect(branchesWeapons).toBe(numOfBranchesWeapons);
      expect(tilesWeapons).toBe(numOfTilesWeapons);
      expect(elixirsWeapons).toBe(numOfElixirsWeapons);
      expect(shacklesWeapons).toBe(numOfShacklesWeapons);
      expect(pillarsWeapons).toBe(numOfPillarsWeapons);
      expect(magatamasWeapons).toBe(numOfMagatamasWeapons);
      expect(gardensWeapons).toBe(numOfGardensWeapons);
      expect(oniWeapons).toBe(numOfOniWeapons);
      expect(mightsWeapons).toBe(numOfMightsWeapons);
      expect(talismansWeapons).toBe(numOfTalismansWeapons);
    })
    .end(done);
});

test("return the correct number of Weapons based on elite enemy material", (done) => {
  const numOfAbyssMagesWeapons = 23;
  const numOfConsBeastsWeapons = 3;
  const numOfFatuiMagesWeapons = 18;
  const numOfFatuiAgentsWeapons = 16;
  const numOfHilichurlRoguesWeapons = 2;
  const numOfRuinMachinesWeapons = 21;
  const numOfMirrorMaidensWeapons = 6;
  const numOfMitachurlsWeapons = 22;
  const numOfPrimalConsWeapons = 4;
  const numOfRiftwolfWeapons = 6;
  const numOfRuinDrakesWeapons = 5;
  const numOfRuinSentsWeapons = 6;
  const numOfShiftedFungiWeapons = 5;
  const numOfBlackSerpentsWeapons = 5;
  const numOfVishapsWeapons = 13;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      let abyssMagesWeapons = 0;
      let consBeastsWeapons = 0;
      let fatuiMagesWeapons = 0;
      let fatuiAgentsWeapons = 0;
      let hilichurlRoguesWeapons = 0;
      let ruinMachinesWeapons = 0;
      let mirrorMaidensWeapons = 0;
      let mitachurlsWeapons = 0;
      let primalConsWeapons = 0;
      let riftwolfWeapons = 0;
      let ruinDrakesWeapons = 0;
      let ruinSentsWeapons = 0;
      let shiftedFungiWeapons = 0;
      let blackSerpentsWeapons = 0;
      let vishapsWeapons = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.eliteEnemyMaterial === "Abyss Mage Materials") {
          abyssMagesWeapons += 1;
        } else if (
          weapon.eliteEnemyMaterial === "Consecrated Beast Materials"
        ) {
          consBeastsWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Fatui Cicin Mage Materials") {
          fatuiMagesWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Fatui Pyro Agent Materials") {
          fatuiAgentsWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Hilichurl Rogue Materials") {
          hilichurlRoguesWeapons += 1;
        } else if (
          weapon.eliteEnemyMaterial === "Humanoid Ruin Machine Materials"
        ) {
          ruinMachinesWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Mirror Maiden Materials") {
          mirrorMaidensWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Mitachurl Materials") {
          mitachurlsWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Primal Construct Materials") {
          primalConsWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Riftwolf Materials") {
          riftwolfWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Ruin Drake Materials") {
          ruinDrakesWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Ruin Sentinel Materials") {
          ruinSentsWeapons += 1;
        } else if (
          weapon.eliteEnemyMaterial === "State-Shifted Fungus Materials"
        ) {
          shiftedFungiWeapons += 1;
        } else if (
          weapon.eliteEnemyMaterial === "The Black Serpents Materials"
        ) {
          blackSerpentsWeapons += 1;
        } else if (weapon.eliteEnemyMaterial === "Vishap Materials") {
          vishapsWeapons += 1;
        }
      });

      expect(abyssMagesWeapons).toBe(numOfAbyssMagesWeapons);
      expect(consBeastsWeapons).toBe(numOfConsBeastsWeapons);
      expect(fatuiMagesWeapons).toBe(numOfFatuiMagesWeapons);
      expect(fatuiAgentsWeapons).toBe(numOfFatuiAgentsWeapons);
      expect(hilichurlRoguesWeapons).toBe(numOfHilichurlRoguesWeapons);
      expect(ruinMachinesWeapons).toBe(numOfRuinMachinesWeapons);
      expect(mirrorMaidensWeapons).toBe(numOfMirrorMaidensWeapons);
      expect(mitachurlsWeapons).toBe(numOfMitachurlsWeapons);
      expect(primalConsWeapons).toBe(numOfPrimalConsWeapons);
      expect(riftwolfWeapons).toBe(numOfRiftwolfWeapons);
      expect(ruinDrakesWeapons).toBe(numOfRuinDrakesWeapons);
      expect(ruinSentsWeapons).toBe(numOfRuinSentsWeapons);
      expect(shiftedFungiWeapons).toBe(numOfShiftedFungiWeapons);
      expect(blackSerpentsWeapons).toBe(numOfBlackSerpentsWeapons);
      expect(vishapsWeapons).toBe(numOfVishapsWeapons);
    })
    .end(done);
});

test("return the correct number of Weapons based on common enemy material", (done) => {
  const numOfFatuiSkirmsWeapons = 15;
  const numOfFungiWeapons = 7;
  const numOfHilichurlsWeapons = 16;
  const numOfHiliShootersWeapons = 22;
  const numOfNobushiWeapons = 9;
  const numOfSamachurlsWeapons = 17;
  const numOfSlimesWeapons = 21;
  const numOfSpectersWeapons = 9;
  const numOfEremitesWeapons = 8;
  const numOfTreasHoardersWeapons = 19;
  const numOfWhopperflowersWeapons = 12;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      let fatuiSkirmsWeapons = 0;
      let fungiWeapons = 0;
      let hilichurlsWeapons = 0;
      let hiliShootersWeapons = 0;
      let nobushiWeapons = 0;
      let samachurlsWeapons = 0;
      let slimesWeapons = 0;
      let spectersWeapons = 0;
      let eremitesWeapons = 0;
      let treasHoardersWeapons = 0;
      let whopperflowersWeapons = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.commonEnemyMaterial === "Fatui Skirmisher Materials") {
          fatuiSkirmsWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "Fungus Materials") {
          fungiWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "Hilichurl Materials") {
          hilichurlsWeapons += 1;
        } else if (
          weapon.commonEnemyMaterial === "Hilichurl Shooter Materials"
        ) {
          hiliShootersWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "Nobushi Materials") {
          nobushiWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "Samachurl Materials") {
          samachurlsWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "Slime Materials") {
          slimesWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "Specter Materials") {
          spectersWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "The Eremites Materials") {
          eremitesWeapons += 1;
        } else if (
          weapon.commonEnemyMaterial === "Treasure Hoarder Materials"
        ) {
          treasHoardersWeapons += 1;
        } else if (weapon.commonEnemyMaterial === "Whopperflower Materials") {
          whopperflowersWeapons += 1;
        }
      });

      expect(fatuiSkirmsWeapons).toBe(numOfFatuiSkirmsWeapons);
      expect(fungiWeapons).toBe(numOfFungiWeapons);
      expect(hilichurlsWeapons).toBe(numOfHilichurlsWeapons);
      expect(hiliShootersWeapons).toBe(numOfHiliShootersWeapons);
      expect(nobushiWeapons).toBe(numOfNobushiWeapons);
      expect(samachurlsWeapons).toBe(numOfSamachurlsWeapons);
      expect(slimesWeapons).toBe(numOfSlimesWeapons);
      expect(spectersWeapons).toBe(numOfSpectersWeapons);
      expect(eremitesWeapons).toBe(numOfEremitesWeapons);
      expect(treasHoardersWeapons).toBe(numOfTreasHoardersWeapons);
      expect(whopperflowersWeapons).toBe(numOfWhopperflowersWeapons);
    })
    .end(done);
});

test("return the correct number of Weapons based on gacha or not", (done) => {
  const numOfGachaWeapons = 80;
  const numOfNonGachaWeapons = 75;

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body.data.weaponData;
      let gachaWeapons = 0;
      let nonGachaWeapons = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.gacha) {
          gachaWeapons += 1;
        } else {
          nonGachaWeapons += 1;
        }
      });

      expect(gachaWeapons).toBe(numOfGachaWeapons);
      expect(nonGachaWeapons).toBe(numOfNonGachaWeapons);
    })
    .end(done);
});

describe("Weapon query argument test suite", () => {
  test("a null filter argument returns an error", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: null) {
          weaponId
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
      query: `query WeaponData {
        weaponData(
          filter: { id: null, weaponName: null, weaponType: null, random: null }
        ) {
          weaponId
        }
      }
      `,
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
        expect(errors[0].message).toBe("Please enter a single filter value.");
      })
      .end(done);
  });

  test("if multiple valid arguments are provided, return an error", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(
          filter: {
            id: "1"
            weaponName: "A Thousand Floating Dreams"
            weaponType: Sword
            random: true
          }
        ) {
          weaponId
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
        expect(errors[0].message).toBe("Please enter a single filter value.");
      })
      .end(done);
  });

  describe("a null argument returns an error", () => {
    test("id", (done) => {
      const queryData = {
        query: `query WeaponData {
          weaponData(filter: { id: null }) {
            weaponId
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

    test("weaponName", (done) => {
      const queryData = {
        query: `query WeaponData {
          weaponData(filter: { weaponName: null }) {
            weaponId
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
            "Invalid argument. Please enter a weapon name."
          );
        })
        .end(done);
    });

    test("foodType", (done) => {
      const queryData = {
        query: `query WeaponData {
          weaponData(filter: { weaponType: null }) {
            weaponId
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
            "Invalid argument. Please enter a weapon type."
          );
        })
        .end(done);
    });

    test("random", (done) => {
      const queryData = {
        query: `query WeaponData {
          weaponData(filter: { random: null }) {
            weaponId
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
      query: `query WeaponData {
        weaponData(filter: { id: "hello" }) {
          weaponId
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

  test("if the Weapon ID exists, return the Weapon", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { id: "1" }) {
          weaponId
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
        const weapon = response.data.weaponData[0];

        expect(weapon).toHaveProperty("weaponId", "1");
      })
      .end(done);
  });

  test("if the Weapon ID does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { id: "14347" }) {
          weaponId
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
        const emptyArray = response.data.weaponData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the Weapon name exists, return the Weapon", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { weaponName: "A Thousand Floating Dreams" }) {
          weaponName
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
        const weapon = response.data.weaponData[0];

        expect(weapon).toHaveProperty(
          "weaponName",
          "A Thousand Floating Dreams"
        );
      })
      .end(done);
  });

  test("if the Weapon name does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { weaponName: "An Actual Gun" }) {
          weaponName
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
        const emptyArray = response.data.weaponData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("return all Weapons of a given Weapon Type", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { weaponType: Sword }) {
          weaponName
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
        const weapons = response.data.weaponData;

        expect(weapons.length).toBeGreaterThan(1);
      })
      .end(done);
  });

  test("return an error if passing a value that doesn't conform to the Weapon Type enum", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { weaponType: "Gun" }) {
          weaponName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const error = response.errors;

        expect(data).toBeUndefined();
        expect(error[0].message).toBe(
          'Enum "WeaponType" cannot represent non-enum value: "Gun".'
        );
      })
      .end(done);
  });

  test("if the random argument is set to true, return a random Weapon", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { random: true }) {
          weaponName
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
        const weapon = response.data.weaponData[0];

        expect(weapon).toHaveProperty("weaponName", "Akuoumaru");
        mathRandomSpy.mockRestore();
      })
      .end(done);
  });

  test("if the random argument is set to false, return Weapon data as if no argument was provided", (done) => {
    const queryData = {
      query: `query WeaponData {
        weaponData(filter: { random: false }) {
          weaponName
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
        const weapons = response.data.weaponData;

        expect(weapons.length).toBeGreaterThan(1);
      })
      .end(done);
  });
});
