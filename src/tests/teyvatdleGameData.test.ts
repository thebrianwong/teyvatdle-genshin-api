import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import GameData from "../types/data/gameData.type";
import { DailyRecordData } from "../generated/graphql";
import { RawData, WebSocket } from "ws";
import { WebSocketData } from "../types/data/webSocketData.type";
import {
  CharacterData,
  ConstellationData,
  FoodData,
  TalentData,
  WeaponData,
} from "../generated/graphql";

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

// test.skip("return Game Data as JSON", (done) => {
//   request(app)
//     .get("/api/teyvatdle")
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .end(done);
// });

test("expect none of the Game Data keys/columns are null", (done) => {
  const queryData = {
    query: `query CharacterData {
      characterData {
        characterId
        characterName
        gender
        height
        rarity
        region
        element
        weaponType
        ascensionStat
        birthday
        characterImageUrl
        characterCorrectImageUrl
        characterWrongImageUrl
        localSpecialty
        localSpecialtyImageUrl
        enhancementMaterial
        enhancementMaterialImageUrl
        ascensionBossMaterial
        ascensionBossMaterialImageUrl
        talentBossMaterial
        talentBossMaterialImageUrl
        talentBook
        talentBookImageUrl
      }
      constellationData {
        constellationId
        constellationName
        constellationLevel
        constellationImageUrl
        characterName
        characterImageUrl
      }
      foodData {
        foodId
        foodName
        rarity
        foodType
        specialDish
        purchasable
        recipe
        event
        foodImageUrl
      }
      talentData {
        talentId
        talentName
        talentType
        talentImageUrl
        characterName
        characterImageUrl
      }
      weaponData {
        weaponId
        weaponName
        rarity
        weaponType
        subStat
        weaponImageUrl
        weaponDomainMaterial
        weaponDomainMaterialImageUrl
        eliteEnemyMaterial
        eliteEnemyMaterialImageUrl
        commonEnemyMaterial
        commonEnemyMaterialImageUrl
        gacha
      }
    }`,
  };

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const gameData: {
        characterData: CharacterData[];
        constellationData: ConstellationData[];
        foodData: FoodData[];
        talentData: TalentData[];
        weaponData: WeaponData[];
      } = res.body.data;
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
  const queryData = {
    query: `query DailyRecordData {
      dailyRecordData {
        dailyRecordId
        characterId
        characterSolved
        weaponId
        weaponSolved
        talentId
        talentSolved
        constellationId
        constellationSolved
        foodId
        foodSolved
      }
    }`,
  };

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect the daily record to contain non-null values", (done) => {
  const queryData = {
    query: `query DailyRecordData {
      dailyRecordData {
        dailyRecordId
        characterId
        characterSolved
        weaponId
        weaponSolved
        talentId
        talentSolved
        constellationId
        constellationSolved
        foodId
        foodSolved
      }
    }`,
  };

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const dailyRecord: DailyRecordData = res.body.data.dailyRecordData;
      expect(dailyRecord).toEqual(
        expect.objectContaining({
          dailyRecordId: expect.anything(),
          characterId: expect.anything(),
          characterSolved: expect.anything(),
          weaponId: expect.anything(),
          weaponSolved: expect.anything(),
          talentId: expect.anything(),
          talentSolved: expect.anything(),
          constellationId: expect.anything(),
          constellationSolved: expect.anything(),
          foodId: expect.anything(),
          foodSolved: expect.anything(),
        })
      );
    })
    .end(done);
});

test("returns the correct daily record for the current mocked date", (done) => {
  const expectedDailyRecordId = "38";
  const queryData = {
    query: `query DailyRecordData {
      dailyRecordData {
        dailyRecordId
      }
    }`,
  };

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const dailyRecord: DailyRecordData = res.body.data.dailyRecordData;
      expect(dailyRecord).toEqual(
        expect.objectContaining({
          dailyRecordId: expectedDailyRecordId,
        })
      );
    })
    .end(done);
});

test("updating the current daily record for Character returns a success", (done) => {
  const mutationData = {
    query: `mutation UpdateDailyRecord {
      updateDailyRecord(id: "38", type: Character)
    }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: string = res.body.data.updateDailyRecord;
      expect(resultsMessage).toContain("Daily record updated. character:");
    })
    .end(done);
});

test("updating the current daily record for Weapon returns a success", (done) => {
  const mutationData = {
    query: `mutation UpdateDailyRecord {
      updateDailyRecord(id: "38", type: Weapon)
    }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: string = res.body.data.updateDailyRecord;
      expect(resultsMessage).toContain("Daily record updated. weapon:");
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

describe("WebSocket related tests", () => {
  test("an updated daily record solved value is sent via WebSocket after patching the daily record", (done) => {
    const wsConnection = new WebSocket("ws://localhost:3001");
    let wsData: RawData;
    wsConnection.on("message", (data) => {
      wsData = data;
    });

    const validDailyRecordID = 38;

    request(app)
      .patch(`/api/teyvatdle/daily_record/${validDailyRecordID}/character`)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(() => {
        expect(wsData).toBeDefined();
        wsConnection.terminate();
      })
      .end(done);
  });

  test("the updated value sent via WebSocket is greater than the value before the patch request by 1", (done) => {
    const validDailyRecordID = 38;
    let beforeCharacterSolved: number;

    const wsConnection = new WebSocket("ws://localhost:3001");
    let wsData: WebSocketData;
    wsConnection.on("message", async (data) => {
      const parsedData: WebSocketData = await JSON.parse(data.toString());
      wsData = parsedData;
    });

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
          .expect(() => {
            expect(wsData.newSolvedValue).toBe(beforeCharacterSolved + 1);
            wsConnection.terminate();
          })
          .end(done);
      });
  });
});
