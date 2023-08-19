import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import GameData from "../types/data/gameData.type";
import DailyRecordData from "../types/data/dailyRecordData.type";

beforeAll(async () => {
  await configSetup("Teyvatdle Game Data");
});

afterAll(async () => {
  await configTeardown("Teyvatdle Game Data");
});

let dateNowSpy: jest.SpyInstance;

beforeEach(() => {
  const testDate = new Date("2023-08-08T00:00:00-08:00");
  dateNowSpy = jest.spyOn(global, "Date").mockImplementation(() => {
    return testDate;
  });
});

afterEach(() => {
  dateNowSpy.mockRestore();
});

test("return Game Data as JSON", (done) => {
  request(app)
    .get("/api/teyvatdle")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Game Data keys/columns are null", (done) => {
  request(app)
    .get("/api/teyvatdle")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const gameData: GameData = res.body;
      expect(gameData).toEqual(
        expect.objectContaining({
          characterData: expect.anything(),
          weaponData: expect.anything(),
          talentData: expect.anything(),
          constellationData: expect.anything(),
          foodData: expect.anything(),
        })
      );
    })
    .end(done);
});

test("return the daily record as JSON", (done) => {
  request(app)
    .get("/api/teyvatdle/daily_record")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect the daily record to contain non-null values", (done) => {
  request(app)
    .get("/api/teyvatdle/daily_record")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const dailyRecord: DailyRecordData = res.body;
      expect(dailyRecord).toEqual(
        expect.objectContaining({
          daily_record_id: expect.anything(),
          character_id: expect.anything(),
          character_solved: expect.anything(),
          weapon_id: expect.anything(),
          weapon_solved: expect.anything(),
          talent_id: expect.anything(),
          talent_solved: expect.anything(),
          constellation_id: expect.anything(),
          constellation_solved: expect.anything(),
          food_id: expect.anything(),
          food_solved: expect.anything(),
        })
      );
    })
    .end(done);
});

test("returns the correct daily record for the current mocked date", (done) => {
  const expectedDailyRecordId = 38;
  request(app)
    .get("/api/teyvatdle/daily_record")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const dailyRecord: DailyRecordData = res.body;
      expect(dailyRecord).toEqual(
        expect.objectContaining({
          daily_record_id: expectedDailyRecordId,
        })
      );
    })
    .end(done);
});

test("patching the current daily record for character returns a success", (done) => {
  const validDailyRecordID = 38;
  request(app)
    .patch(`/api/teyvatdle/daily_record/${validDailyRecordID}/character`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "Daily record updated.",
          success: true,
        })
      );
    })
    .end(done);
});

test("patching the current daily record for weapon returns a success", (done) => {
  const validDailyRecordID = 38;
  request(app)
    .patch(`/api/teyvatdle/daily_record/${validDailyRecordID}/weapon`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "Daily record updated.",
          success: true,
        })
      );
    })
    .end(done);
});

test("patching the current daily record for talent returns a success", (done) => {
  const validDailyRecordID = 38;
  request(app)
    .patch(`/api/teyvatdle/daily_record/${validDailyRecordID}/talent`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "Daily record updated.",
          success: true,
        })
      );
    })
    .end(done);
});

test("patching the current daily record for constellation returns a success", (done) => {
  const validDailyRecordID = 38;
  request(app)
    .patch(`/api/teyvatdle/daily_record/${validDailyRecordID}/constellation`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "Daily record updated.",
          success: true,
        })
      );
    })
    .end(done);
});

test("patching the current daily record for food returns a success", (done) => {
  const validDailyRecordID = 38;
  request(app)
    .patch(`/api/teyvatdle/daily_record/${validDailyRecordID}/food`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "Daily record updated.",
          success: true,
        })
      );
    })
    .end(done);
});

test("patching the current daily record for character increases the number of time character has been solved by 1", (done) => {
  const validDailyRecordID = 38;
  let beforeCharacterSolved: number;

  request(app)
    .get("/api/teyvatdle/daily_record")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const beforeDailyRecord: DailyRecordData = res.body;
      beforeCharacterSolved = beforeDailyRecord.character_solved;
    })
    .then(() => {
      request(app)
        .patch(`/api/teyvatdle/daily_record/${validDailyRecordID}/character`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(() => {
          request(app)
            .get("/api/teyvatdle/daily_record")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
              const afterDailyRecord: DailyRecordData = res.body;
              const afterCharacterSolved = afterDailyRecord.character_solved;
              expect(afterCharacterSolved).toBe(beforeCharacterSolved + 1);
            })
            .end(done);
        });
    });
});

test("attempting to patch an invalid resource in the daily record returns a 400 and corresponding error message", (done) => {
  const validDailyRecordID = 38;
  request(app)
    .patch(
      `/api/teyvatdle/daily_record/${validDailyRecordID}/reallyrealresource`
    )
    .expect("Content-Type", /json/)
    .expect(400)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "That is not a valid resource.",
          success: false,
        })
      );
    })
    .end(done);
});

test("attempting to patch a daily record with an invalid ID (not a number) returns a 404 and corresponding error message", (done) => {
  request(app)
    .patch("/api/teyvatdle/daily_record/onemillion/character")
    .expect("Content-Type", /json/)
    .expect(404)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "That daily record does not exist.",
          success: false,
        })
      );
    })
    .end(done);
});

test("attempting to patch a nonexistent daily record returns a 404 and corresponding error message", (done) => {
  const nonexistentDailyRecordID = -1;
  request(app)
    .patch(`/api/teyvatdle/daily_record/${nonexistentDailyRecordID}/character`)
    .expect("Content-Type", /json/)
    .expect(404)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "That daily record does not exist.",
          success: false,
        })
      );
    })
    .end(done);
});

test("attempting to patch a daily record from the past returns a 400 and corresponding error message", (done) => {
  // prevents returned daily record from also having the mocked Date
  dateNowSpy.mockRestore();
  const pastDailyRecordID = 2;
  request(app)
    .patch(`/api/teyvatdle/daily_record/${pastDailyRecordID}/character`)
    .expect("Content-Type", /json/)
    .expect(400)
    .expect((res) => {
      const resultsMessage: { message: string; success: boolean } = res.body;
      expect(resultsMessage).toEqual(
        expect.objectContaining({
          message: "Unable to update past daily record.",
          success: false,
        })
      );
    })
    .end(done);
});
