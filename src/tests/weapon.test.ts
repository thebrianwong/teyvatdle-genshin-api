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

  // rarity
  const numOfOneStarWeapons = 5;
  const numOfTwoStarWeapons = 5;
  const numOfThreeStarWeapons = 24;
  const numOfFourStarWeapons = 84;
  const numOfFiveStarWeapons = 37;

  // weapon type
  const numOfSwords = 35;
  const numOfClaymores = 30;
  const numOfPolearms = 26;
  const numOfCatalysts = 31;
  const numOfBows = 33;

  // sub stats
  const numOfATKWeapons = 41;
  const numOfCritDMGWeapons = 17;
  const numOfCritRateWeapons = 17;
  const numOfDEFWeapons = 4;
  const numOfElementalMasteryWeapons = 22;
  const numOfEnergyRechargeWeapons = 26;
  const numOfHPWeapons = 9;
  const numOfPhysicalDMGWeapons = 9;
  const numOfNoSubStatWeapons = 10;

  // weapon domain
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

  // elite materials
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

  // common materials
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

  // gacha
  const numOfGachaWeapons = 80;
  const numOfNonGachaWeapons = 75;

  request(app)
    .get("/api/weapon")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: WeaponData[] = res.body;

      const oneStarWeapons = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 1
      );
      const twoStarWeapons = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 2
      );
      const threeStarWeapons = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 3
      );
      const fourStarWeapons = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 4
      );
      const fiveStarWeapons = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 5
      );

      const swords = [...arrayOfDataObjects].filter(
        (data) => data.weapon_type === "Sword"
      );
      const claymores = [...arrayOfDataObjects].filter(
        (data) => data.weapon_type === "Claymore"
      );
      const polearms = [...arrayOfDataObjects].filter(
        (data) => data.weapon_type === "Polearm"
      );
      const catalysts = [...arrayOfDataObjects].filter(
        (data) => data.weapon_type === "Catalyst"
      );
      const bows = [...arrayOfDataObjects].filter(
        (data) => data.weapon_type === "Bow"
      );

      const atkWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "ATK"
      );
      const critDMGWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "CRIT DMG"
      );
      const critRateWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "CRIT Rate"
      );
      const defWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "DEF"
      );
      const elementalMasteryWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "Elemental Mastery"
      );
      const energyRechargeWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "Energy Recharge"
      );
      const hpWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "HP"
      );
      const physicalDMGWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === "Physical DMG Bonus"
      );
      const noSubStatWeapons = [...arrayOfDataObjects].filter(
        (data) => data.sub_stat === null
      );

      const aerosideriteWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Aerosiderite"
      );
      const teethWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Boreal Wolf Teeth"
      );
      const branchesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Branches of a Distant Sea"
      );
      const tilesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Decarabian Tiles"
      );
      const elixirsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Elixirs"
      );
      const shacklesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Gladiator Shackles"
      );
      const pillarsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Guyun Pillars"
      );
      const magatamasWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Narukami's Magatamas"
      );
      const gardensWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Oasis Gardens"
      );
      const oniWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Oni Masks"
      );
      const mightsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Scorching Mights"
      );
      const talismansWeapons = [...arrayOfDataObjects].filter(
        (data) => data.weapon_domain_material === "Talismans of the Forest Dew"
      );

      const abyssMagesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Abyss Mage Materials"
      );
      const consBeastsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Consecrated Beast Materials"
      );
      const fatuiMagesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Fatui Cicin Mage Materials"
      );
      const fatuiAgentsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Fatui Pyro Agent Materials"
      );
      const hilichurlRoguesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Hilichurl Rogue Materials"
      );
      const ruinMachinesWeapons = [...arrayOfDataObjects].filter(
        (data) =>
          data.elite_enemy_material === "Humanoid Ruin Machine Materials"
      );
      const mirrorMaidensWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Mirror Maiden Materials"
      );
      const mitachurlsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Mitachurl Materials"
      );
      const primalConsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Primal Construct Materials"
      );
      const riftwolfWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Riftwolf Materials"
      );
      const ruinDrakesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Ruin Drake Materials"
      );
      const ruinSentsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Ruin Sentinel Materials"
      );
      const shiftedFungiWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "State-Shifted Fungus Materials"
      );
      const blackSerpentsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "The Black Serpents Materials"
      );
      const vishapsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.elite_enemy_material === "Vishap Materials"
      );

      const fatuiSkirmsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Fatui Skirmisher Materials"
      );
      const fungiWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Fungus Materials"
      );
      const hilichurlsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Hilichurl Materials"
      );
      const hiliShootersWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Hilichurl Shooter Materials"
      );
      const nobushiWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Nobushi Materials"
      );
      const samachurlsWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Samachurl Materials"
      );
      const slimesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Slime Materials"
      );
      const spectersWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Specter Materials"
      );
      const eremitesWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "The Eremites Materials"
      );
      const treasHoardersWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Treasure Hoarder Materials"
      );
      const whopperflowersWeapons = [...arrayOfDataObjects].filter(
        (data) => data.common_enemy_material === "Whopperflower Materials"
      );

      const gachaWeapons = [...arrayOfDataObjects].filter(
        (data) => data.gacha === true
      );
      const nonGachaWeapons = [...arrayOfDataObjects].filter(
        (data) => data.gacha === false
      );

      expect(arrayOfDataObjects).toHaveLength(numOfWeapons);

      expect(oneStarWeapons).toHaveLength(numOfOneStarWeapons);
      expect(twoStarWeapons).toHaveLength(numOfTwoStarWeapons);
      expect(threeStarWeapons).toHaveLength(numOfThreeStarWeapons);
      expect(fourStarWeapons).toHaveLength(numOfFourStarWeapons);
      expect(fiveStarWeapons).toHaveLength(numOfFiveStarWeapons);

      expect(swords).toHaveLength(numOfSwords);
      expect(claymores).toHaveLength(numOfClaymores);
      expect(polearms).toHaveLength(numOfPolearms);
      expect(catalysts).toHaveLength(numOfCatalysts);
      expect(bows).toHaveLength(numOfBows);

      expect(atkWeapons).toHaveLength(numOfATKWeapons);
      expect(critDMGWeapons).toHaveLength(numOfCritDMGWeapons);
      expect(critRateWeapons).toHaveLength(numOfCritRateWeapons);
      expect(defWeapons).toHaveLength(numOfDEFWeapons);
      expect(elementalMasteryWeapons).toHaveLength(
        numOfElementalMasteryWeapons
      );
      expect(energyRechargeWeapons).toHaveLength(numOfEnergyRechargeWeapons);
      expect(hpWeapons).toHaveLength(numOfHPWeapons);
      expect(physicalDMGWeapons).toHaveLength(numOfPhysicalDMGWeapons);
      expect(noSubStatWeapons).toHaveLength(numOfNoSubStatWeapons);

      expect(aerosideriteWeapons).toHaveLength(numOfAerosideriteWeapons);
      expect(teethWeapons).toHaveLength(numOfTeethWeapons);
      expect(branchesWeapons).toHaveLength(numOfBranchesWeapons);
      expect(tilesWeapons).toHaveLength(numOfTilesWeapons);
      expect(elixirsWeapons).toHaveLength(numOfElixirsWeapons);
      expect(shacklesWeapons).toHaveLength(numOfShacklesWeapons);
      expect(pillarsWeapons).toHaveLength(numOfPillarsWeapons);
      expect(magatamasWeapons).toHaveLength(numOfMagatamasWeapons);
      expect(gardensWeapons).toHaveLength(numOfGardensWeapons);
      expect(oniWeapons).toHaveLength(numOfOniWeapons);
      expect(mightsWeapons).toHaveLength(numOfMightsWeapons);
      expect(talismansWeapons).toHaveLength(numOfTalismansWeapons);

      expect(abyssMagesWeapons).toHaveLength(numOfAbyssMagesWeapons);
      expect(consBeastsWeapons).toHaveLength(numOfConsBeastsWeapons);
      expect(fatuiMagesWeapons).toHaveLength(numOfFatuiMagesWeapons);
      expect(fatuiAgentsWeapons).toHaveLength(numOfFatuiAgentsWeapons);
      expect(hilichurlRoguesWeapons).toHaveLength(numOfHilichurlRoguesWeapons);
      expect(ruinMachinesWeapons).toHaveLength(numOfRuinMachinesWeapons);
      expect(mirrorMaidensWeapons).toHaveLength(numOfMirrorMaidensWeapons);
      expect(mitachurlsWeapons).toHaveLength(numOfMitachurlsWeapons);
      expect(primalConsWeapons).toHaveLength(numOfPrimalConsWeapons);
      expect(riftwolfWeapons).toHaveLength(numOfRiftwolfWeapons);
      expect(ruinDrakesWeapons).toHaveLength(numOfRuinDrakesWeapons);
      expect(ruinSentsWeapons).toHaveLength(numOfRuinSentsWeapons);
      expect(shiftedFungiWeapons).toHaveLength(numOfShiftedFungiWeapons);
      expect(blackSerpentsWeapons).toHaveLength(numOfBlackSerpentsWeapons);
      expect(vishapsWeapons).toHaveLength(numOfVishapsWeapons);

      expect(fatuiSkirmsWeapons).toHaveLength(numOfFatuiSkirmsWeapons);
      expect(fungiWeapons).toHaveLength(numOfFungiWeapons);
      expect(hilichurlsWeapons).toHaveLength(numOfHilichurlsWeapons);
      expect(hiliShootersWeapons).toHaveLength(numOfHiliShootersWeapons);
      expect(nobushiWeapons).toHaveLength(numOfNobushiWeapons);
      expect(samachurlsWeapons).toHaveLength(numOfSamachurlsWeapons);
      expect(slimesWeapons).toHaveLength(numOfSlimesWeapons);
      expect(spectersWeapons).toHaveLength(numOfSpectersWeapons);
      expect(eremitesWeapons).toHaveLength(numOfEremitesWeapons);
      expect(treasHoardersWeapons).toHaveLength(numOfTreasHoardersWeapons);
      expect(whopperflowersWeapons).toHaveLength(numOfWhopperflowersWeapons);

      expect(gachaWeapons).toHaveLength(numOfGachaWeapons);
      expect(nonGachaWeapons).toHaveLength(numOfNonGachaWeapons);
    })
    .end(done);
});
