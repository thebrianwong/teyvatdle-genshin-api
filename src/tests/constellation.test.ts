import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import ConstellationData from "../types/data/constellationData.type";

beforeAll(async () => {
  await configSetup("Constellation");
});

afterAll(async () => {
  await configTeardown("Constellation");
});

test("return Constellations as JSON", (done) => {
  request(app)
    .get("/api/constellation")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Constellation keys/columns are null", (done) => {
  request(app)
    .get("/api/constellation")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: ConstellationData[] = res.body;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            constellation_name: expect.anything(),
            constellation_level: expect.anything(),
            constellation_image_url: expect.anything(),
            character_name: expect.anything(),
            character_image_url: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("returned Constellation data has the correct types for values", (done) => {
  request(app)
    .get("/api/constellation")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: ConstellationData[] = res.body;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.constellation_name).toBe("string");
        expect(typeof data.constellation_level).toBe("number");
        expect(typeof data.constellation_image_url).toBe("string");
        expect(typeof data.character_name).toBe("string");
        expect(typeof data.character_image_url).toBe("string");
      });
    })
    .end(done);
});

test("return the correct number of Constellations", (done) => {
  const numOfConstellations = 426;
  request(app)
    .get("/api/constellation")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: ConstellationData[] = res.body;
      expect(arrayOfDataObjects).toHaveLength(numOfConstellations);
    })
    .end(done);
});
