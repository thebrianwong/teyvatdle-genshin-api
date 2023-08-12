import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";

beforeAll(async () => {
  await configSetup("Region");
});

afterAll(async () => {
  await configTeardown("Region");
});

test("return Regions as JSON", (done) => {
  request(app)
    .get("/api/region")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toBeDefined();
    })
    .end(done);
});
