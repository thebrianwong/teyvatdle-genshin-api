import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import TalentData from "../types/data/talentData.type";

beforeAll(async () => {
  await configSetup("Local Specialty");
});

afterAll(async () => {
  await configTeardown("Local Specialty");
});

test("return Talents as JSON", (done) => {
  request(app)
    .get("/api/talent")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Talent keys/columns are null", (done) => {
  request(app)
    .get("/api/talent")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: TalentData[] = res.body;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            talent_id: expect.anything(),
            talent_name: expect.anything(),
            talent_type: expect.anything(),
            talent_image_url: expect.anything(),
            character: expect.anything(),
            character_image_url: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("returned Talent data has the correct types for values", (done) => {
  request(app)
    .get("/api/talent")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: TalentData[] = res.body;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.talent_id).toBe("number");
        expect(typeof data.talent_name).toBe("string");
        expect([
          "Normal Attack",
          "Elemental Skill",
          "Alternate Sprint",
          "Elemental Burst",
          "1st Ascension Passive",
          "4th Ascension Passive",
          "Utility Passive",
          "Passive",
        ]).toContain(data.talent_type);
        expect(typeof data.talent_image_url).toBe("string");
        expect(typeof data.character).toBe("string");
        expect(typeof data.character_image_url).toBe("string");
      });
    })
    .end(done);
});

test("return the correct number of Talents", (done) => {
  const numOfTalents = 425;
  const numOfNonTravelerTalents = 405;
  const numOfTravelerTalents = 20;
  const numOfAltSprintTalents = 2;
  const numOfKokomiPassiveTalents = 1;
  const travelerNames = [
    "Traveler (Anemo)",
    "Traveler (Geo)",
    "Traveler (Electro)",
    "Traveler (Dendro)",
  ];
  request(app)
    .get("/api/talent")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: TalentData[] = res.body;
      const nonTravelerTalents = [...arrayOfDataObjects].filter(
        (data) => !travelerNames.includes(data.character)
      );
      const travelerTalents = [...arrayOfDataObjects].filter((data) =>
        travelerNames.includes(data.character)
      );
      const altSprintTalents = [...arrayOfDataObjects].filter(
        (data) => data.talent_type === "Alternate Sprint"
      );
      const kokomiPassiveTalents = [...arrayOfDataObjects].filter(
        (data) => data.talent_type === "Passive"
      );

      expect(arrayOfDataObjects).toHaveLength(numOfTalents);
      expect(nonTravelerTalents).toHaveLength(numOfNonTravelerTalents);
      expect(travelerTalents).toHaveLength(numOfTravelerTalents);
      expect(altSprintTalents).toHaveLength(numOfAltSprintTalents);
      expect(kokomiPassiveTalents).toHaveLength(numOfKokomiPassiveTalents);
    })
    .end(done);
});
