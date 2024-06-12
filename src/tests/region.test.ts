import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import expireAllKeys from "../redis/expireAllKeys";

beforeAll(async () => {
  await configSetup("Region");
});

afterAll(async () => {
  await expireAllKeys();
  await configTeardown("Region");
});

beforeEach(async () => {
  await expireAllKeys();
});

const queryData = {
  query: `query RegionData {
    regionData {
      id
      name
    }
  }`,
};

test.only("return Regions as JSON", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const [mondstadt, liyue, inazuma, sumeru, fontaine, natlan, snezhnaya] =
        res.body.data.regionData;
      expect(res.body).toBeDefined();
      expect(mondstadt).toMatchObject({
        id: "1",
        name: "Mondstadt",
      });
      expect(liyue).toMatchObject({
        id: "2",
        name: "Liyue",
      });
      expect(inazuma).toMatchObject({
        id: "3",
        name: "Inazuma",
      });
      expect(sumeru).toMatchObject({
        id: "4",
        name: "Sumeru",
      });
      expect(fontaine).toMatchObject({
        id: "5",
        name: "Fontaine",
      });
      expect(natlan).toMatchObject({
        id: "6",
        name: "Natlan",
      });
      expect(snezhnaya).toMatchObject({
        id: "7",
        name: "Snezhnaya",
      });
    })
    .end(done);
});
