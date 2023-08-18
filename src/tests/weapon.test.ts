import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import WeaponData from "../types/data/weaponData.type";

beforeAll(async () => {
  await configSetup("Weapon");
});

afterAll(async () => {
  await configTeardown("Weapon");
});

test("return Weapons as JSON", (done) => {
  request(app)
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Weapon keys/columns (except Sub Stat) are null", (done) => {
  request(app)
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
      const oneAndTwoStarWeapons = arrayOfDataObjects.filter(
        (weapon) => weapon.rarity !== 1 && weapon.rarity !== 2
      );
      expect(oneAndTwoStarWeapons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            weapon_id: expect.anything(),
            weapon_name: expect.anything(),
            rarity: expect.anything(),
            weapon_type: expect.anything(),
            sub_stat: expect.anything(),
            weapon_image_url: expect.anything(),
            weapon_domain_material: expect.anything(),
            weapon_domain_material_image_url: expect.anything(),
            elite_enemy_material: expect.anything(),
            elite_enemy_material_image_url: expect.anything(),
            common_enemy_material: expect.anything(),
            common_enemy_material_image_url: expect.anything(),
            gacha: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("expect 1 and 2 star weapons have null Sub Stats", (done) => {
  request(app)
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
      const oneAndTwoStarWeapons = arrayOfDataObjects.filter(
        (weapon) => weapon.rarity === 1 || weapon.rarity === 2
      );
      expect(oneAndTwoStarWeapons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sub_stat: null,
          }),
        ])
      );
    })
    .end(done);
});

test("returned Weapon data has the correct types for values", (done) => {
  request(app)
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.weapon_id).toBe("number");
        expect(typeof data.weapon_name).toBe("string");
        expect(typeof data.rarity).toBe("number");
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
        ]).toContain(data.sub_stat);
        expect(typeof data.weapon_image_url).toBe("string");
        expect(typeof data.weapon_domain_material).toBe("string");
        expect(typeof data.weapon_domain_material_image_url).toBe("string");
        expect(typeof data.elite_enemy_material).toBe("string");
        expect(typeof data.elite_enemy_material_image_url).toBe("string");
        expect(typeof data.common_enemy_material).toBe("string");
        expect(typeof data.common_enemy_material_image_url).toBe("string");
        expect(typeof data.gacha).toBe("boolean");
      });
    })
    .end(done);
});

test("return the correct number of Weapons", (done) => {
  const numOfWeapons = 155;

  request(app)
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;

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
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
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
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
      let swords = 0;
      let claymores = 0;
      let polearms = 0;
      let catalysts = 0;
      let bows = 0;

      arrayOfDataObjects.forEach((weapon) => {
        if (weapon.weapon_type === "Sword") {
          swords += 1;
        } else if (weapon.weapon_type === "Claymore") {
          claymores += 1;
        } else if (weapon.weapon_type === "Polearm") {
          polearms += 1;
        } else if (weapon.weapon_type === "Catalyst") {
          catalysts += 1;
        } else if (weapon.weapon_type === "Bow") {
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
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
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
        if (weapon.sub_stat === "ATK") {
          atkWeapons += 1;
        } else if (weapon.sub_stat === "CRIT DMG") {
          critDMGWeapons += 1;
        } else if (weapon.sub_stat === "CRIT Rate") {
          critRateWeapons += 1;
        } else if (weapon.sub_stat === "DEF") {
          defWeapons += 1;
        } else if (weapon.sub_stat === "Elemental Mastery") {
          elementalMasteryWeapons += 1;
        } else if (weapon.sub_stat === "Energy Recharge") {
          energyRechargeWeapons += 1;
        } else if (weapon.sub_stat === "HP") {
          hpWeapons += 1;
        } else if (weapon.sub_stat === "Physical DMG Bonus") {
          physicalDMGWeapons += 1;
        } else if (weapon.sub_stat === null) {
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
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
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
        if (weapon.weapon_domain_material === "Aerosiderite") {
          aerosideriteWeapons += 1;
        } else if (weapon.weapon_domain_material === "Boreal Wolf Teeth") {
          teethWeapons += 1;
        } else if (
          weapon.weapon_domain_material === "Branches of a Distant Sea"
        ) {
          branchesWeapons += 1;
        } else if (weapon.weapon_domain_material === "Decarabian Tiles") {
          tilesWeapons += 1;
        } else if (weapon.weapon_domain_material === "Elixirs") {
          elixirsWeapons += 1;
        } else if (weapon.weapon_domain_material === "Gladiator Shackles") {
          shacklesWeapons += 1;
        } else if (weapon.weapon_domain_material === "Guyun Pillars") {
          pillarsWeapons += 1;
        } else if (weapon.weapon_domain_material === "Narukami's Magatamas") {
          magatamasWeapons += 1;
        } else if (weapon.weapon_domain_material === "Oasis Gardens") {
          gardensWeapons += 1;
        } else if (weapon.weapon_domain_material === "Oni Masks") {
          oniWeapons += 1;
        } else if (weapon.weapon_domain_material === "Scorching Mights") {
          mightsWeapons += 1;
        } else if (
          weapon.weapon_domain_material === "Talismans of the Forest Dew"
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
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
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
        if (weapon.elite_enemy_material === "Abyss Mage Materials") {
          abyssMagesWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "Consecrated Beast Materials"
        ) {
          consBeastsWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "Fatui Cicin Mage Materials"
        ) {
          fatuiMagesWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "Fatui Pyro Agent Materials"
        ) {
          fatuiAgentsWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "Hilichurl Rogue Materials"
        ) {
          hilichurlRoguesWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "Humanoid Ruin Machine Materials"
        ) {
          ruinMachinesWeapons += 1;
        } else if (weapon.elite_enemy_material === "Mirror Maiden Materials") {
          mirrorMaidensWeapons += 1;
        } else if (weapon.elite_enemy_material === "Mitachurl Materials") {
          mitachurlsWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "Primal Construct Materials"
        ) {
          primalConsWeapons += 1;
        } else if (weapon.elite_enemy_material === "Riftwolf Materials") {
          riftwolfWeapons += 1;
        } else if (weapon.elite_enemy_material === "Ruin Drake Materials") {
          ruinDrakesWeapons += 1;
        } else if (weapon.elite_enemy_material === "Ruin Sentinel Materials") {
          ruinSentsWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "State-Shifted Fungus Materials"
        ) {
          shiftedFungiWeapons += 1;
        } else if (
          weapon.elite_enemy_material === "The Black Serpents Materials"
        ) {
          blackSerpentsWeapons += 1;
        } else if (weapon.elite_enemy_material === "Vishap Materials") {
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
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
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
        if (weapon.common_enemy_material === "Fatui Skirmisher Materials") {
          fatuiSkirmsWeapons += 1;
        } else if (weapon.common_enemy_material === "Fungus Materials") {
          fungiWeapons += 1;
        } else if (weapon.common_enemy_material === "Hilichurl Materials") {
          hilichurlsWeapons += 1;
        } else if (
          weapon.common_enemy_material === "Hilichurl Shooter Materials"
        ) {
          hiliShootersWeapons += 1;
        } else if (weapon.common_enemy_material === "Nobushi Materials") {
          nobushiWeapons += 1;
        } else if (weapon.common_enemy_material === "Samachurl Materials") {
          samachurlsWeapons += 1;
        } else if (weapon.common_enemy_material === "Slime Materials") {
          slimesWeapons += 1;
        } else if (weapon.common_enemy_material === "Specter Materials") {
          spectersWeapons += 1;
        } else if (weapon.common_enemy_material === "The Eremites Materials") {
          eremitesWeapons += 1;
        } else if (
          weapon.common_enemy_material === "Treasure Hoarder Materials"
        ) {
          treasHoardersWeapons += 1;
        } else if (weapon.common_enemy_material === "Whopperflower Materials") {
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
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;
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
