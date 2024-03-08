import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { TalentData } from "../generated/graphql";

beforeAll(async () => {
  await configSetup("Talent");
});

afterAll(async () => {
  await configTeardown("Talent");
});

const queryData = {
  query: `query TalentData {
    talentData {
      talentId
      talentName
      talentType
      talentImageUrl
      characterName
      characterImageUrl
    }
  }`,
};

test("return Talents as JSON", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Talent keys/columns are null", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: TalentData[] = res.body.data.talentData;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            talentId: expect.anything(),
            talentName: expect.anything(),
            talentType: expect.anything(),
            talentImageUrl: expect.anything(),
            characterName: expect.anything(),
            characterImageUrl: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("returned Talent data has the correct types for values", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: TalentData[] = res.body.data.talentData;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.talentId).toBe("string");
        expect(typeof data.talentName).toBe("string");
        expect([
          "Normal_Attack",
          "Elemental_Skill",
          "Alternate_Sprint",
          "Elemental_Burst",
          "First_Ascension_Passive",
          "Fourth_Ascension_Passive",
          "Utility_Passive",
          "Passive",
        ]).toContain(data.talentType);
        expect(typeof data.talentImageUrl).toBe("string");
        expect(typeof data.characterName).toBe("string");
        expect(typeof data.characterImageUrl).toBe("string");
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
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: TalentData[] = res.body.data.talentData;
      let nonTravelerTalents = 0;
      let travelerTalents = 0;
      let altSprintTalents = 0;
      let kokomiPassiveTalents = 0;

      arrayOfDataObjects.forEach((talent) => {
        if (!travelerNames.includes(talent.characterName)) {
          nonTravelerTalents += 1;
        } else {
          travelerTalents += 1;
        }
        if (talent.talentType === "Alternate_Sprint") {
          altSprintTalents += 1;
        } else if (talent.talentType === "Passive") {
          kokomiPassiveTalents += 1;
        }
      });

      expect(arrayOfDataObjects).toHaveLength(numOfTalents);
      expect(nonTravelerTalents).toBe(numOfNonTravelerTalents);
      expect(travelerTalents).toBe(numOfTravelerTalents);
      expect(altSprintTalents).toBe(numOfAltSprintTalents);
      expect(kokomiPassiveTalents).toBe(numOfKokomiPassiveTalents);
    })
    .end(done);
});
