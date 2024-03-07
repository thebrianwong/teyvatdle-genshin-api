import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { ConstellationData } from "../generated/graphql";

beforeAll(async () => {
  await configSetup("Constellation");
});

afterAll(async () => {
  await configTeardown("Constellation");
});

const queryData = {
  query: `query ConstellationData {
    constellationData {
      constellationId
      constellationName
      constellationLevel
      constellationImageUrl
      characterName
      characterImageUrl
    }
  }`,
};

test("return Constellations as JSON", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Constellation keys/columns are null", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: ConstellationData[] =
        res.body.data.constellationData;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            constellationName: expect.anything(),
            constellationLevel: expect.anything(),
            constellationImageUrl: expect.anything(),
            characterName: expect.anything(),
            characterImageUrl: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("returned Constellation data has the correct types for values", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: ConstellationData[] =
        res.body.data.constellationData;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.constellationName).toBe("string");
        expect(typeof data.constellationLevel).toBe("number");
        expect(typeof data.constellationImageUrl).toBe("string");
        expect(typeof data.characterName).toBe("string");
        expect(typeof data.characterImageUrl).toBe("string");
      });
    })
    .end(done);
});

test("return the correct number of Constellations", (done) => {
  const numOfConstellations = 426;
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: ConstellationData[] =
        res.body.data.constellationData;
      expect(arrayOfDataObjects).toHaveLength(numOfConstellations);
    })
    .end(done);
});
