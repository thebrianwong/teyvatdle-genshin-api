import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import LocalSpecialtyData from "../types/data/localSpecialtyData.type";

beforeAll(async () => {
  await configSetup("Local Specialty");
});

afterAll(async () => {
  await configTeardown("Local Specialty");
});

test("return Local Specialties as JSON", (done) => {
  request(app)
    .get("/api/local_specialty")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Local Specialty keys/columns are null", (done) => {
  request(app)
    .get("/api/local_specialty")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: LocalSpecialtyData[] = res.body;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            local_specialty: expect.anything(),
            region: expect.anything(),
            image_url: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("returned Local Specialty data has the correct types for values", (done) => {
  request(app)
    .get("/api/local_specialty")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: LocalSpecialtyData[] = res.body;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.local_specialty).toBe("string");
        expect(["Mondstadt", "Liyue", "Inazuma", "Sumeru"]).toContain(
          data.region
        );
        expect(typeof data.image_url).toBe("string");
      });
    })
    .end(done);
});

test("return the correct number of Local Specialties from each region", (done) => {
  const numOfLocalSpecialties = 34;
  const numOfMondstadtSpecialties = 8;
  const numOfLiyueSpecialties = 8;
  const numOfInazumaSpecialties = 9;
  const numOfSumeruSpecialties = 9;
  request(app)
    .get("/api/local_specialty")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: LocalSpecialtyData[] = res.body;
      let mondstadtSpecialties = 0;
      let liyueSpecialties = 0;
      let inazumaSpecialties = 0;
      let sumeruSpecialties = 0;

      arrayOfDataObjects.forEach((localSpecialty) => {
        if (localSpecialty.region === "Mondstadt") {
          mondstadtSpecialties += 1;
        } else if (localSpecialty.region === "Liyue") {
          liyueSpecialties += 1;
        } else if (localSpecialty.region === "Inazuma") {
          inazumaSpecialties += 1;
        } else if (localSpecialty.region === "Sumeru") {
          sumeruSpecialties += 1;
        }
      });

      expect(arrayOfDataObjects).toHaveLength(numOfLocalSpecialties);
      expect(mondstadtSpecialties).toBe(numOfMondstadtSpecialties);
      expect(liyueSpecialties).toBe(numOfLiyueSpecialties);
      expect(inazumaSpecialties).toBe(numOfInazumaSpecialties);
      expect(sumeruSpecialties).toBe(numOfSumeruSpecialties);
    })
    .end(done);
});
