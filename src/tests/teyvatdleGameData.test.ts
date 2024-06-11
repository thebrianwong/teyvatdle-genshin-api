import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { DailyRecordData, GameDataType } from "../generated/graphql";
import { WebSocket } from "ws";
import {
  CharacterData,
  ConstellationData,
  FoodData,
  TalentData,
  WeaponData,
} from "../generated/graphql";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
import expireAllKeys from "../redis/expireAllKeys";

beforeAll(async () => {
  await configSetup("Teyvatdle Game Data");
});

afterAll(async () => {
  await expireAllKeys();
  await configTeardown("Teyvatdle Game Data");
});

let dateNowSpy: jest.SpyInstance;
let dateGetDateSpy: jest.SpyInstance;

beforeEach(async () => {
  dateGetDateSpy = jest
    .spyOn(global.Date.prototype, "getDate")
    .mockImplementation(() => {
      return 8;
    });

  const testDate = new Date("2023-08-08T00:00:00-08:00");
  dateNowSpy = jest.spyOn(global, "Date").mockImplementation(() => {
    return testDate;
  });

  await expireAllKeys();
});

afterEach(() => {
  dateNowSpy.mockRestore();
  dateGetDateSpy.mockRestore();
});

const validDailyRecordID = 38;

test("return Game Data as JSON", (done) => {
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
    .end(done);
});

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
        characterSolved
        weaponSolved
        talentSolved
        constellationSolved
        foodSolved
        character {
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
        weapon {
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
        talent {
          talentId
          talentName
          talentType
          talentImageUrl
          characterName
          characterImageUrl
        }
        constellation {
          constellationId
          constellationName
          constellationLevel
          constellationImageUrl
          characterName
          characterImageUrl
        }
        food {
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
        characterSolved
        weaponSolved
        talentSolved
        constellationSolved
        foodSolved
        character {
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
        weapon {
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
        talent {
          talentId
          talentName
          talentType
          talentImageUrl
          characterName
          characterImageUrl
        }
        constellation {
          constellationId
          constellationName
          constellationLevel
          constellationImageUrl
          characterName
          characterImageUrl
        }
        food {
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
          character: expect.anything(),
          characterSolved: expect.anything(),
          weapon: expect.anything(),
          weaponSolved: expect.anything(),
          talent: expect.anything(),
          talentSolved: expect.anything(),
          constellation: expect.anything(),
          constellationSolved: expect.anything(),
          food: expect.anything(),
          foodSolved: expect.anything(),
        })
      );
    })
    .end(done);
});

describe("expect the daily record to contain nested objects with queried properties", () => {
  test("Character", (done) => {
    const queryData = {
      query: `query DailyRecordData {
        dailyRecordData {
          character {
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
        expect(Object.keys(dailyRecord.character)).toEqual(
          expect.arrayContaining([
            "characterName",
            "gender",
            "height",
            "rarity",
            "region",
            "element",
            "weaponType",
            "ascensionStat",
            "birthday",
            "characterImageUrl",
            "characterCorrectImageUrl",
            "characterWrongImageUrl",
            "localSpecialty",
            "localSpecialtyImageUrl",
            "enhancementMaterial",
            "enhancementMaterialImageUrl",
            "ascensionBossMaterial",
            "ascensionBossMaterialImageUrl",
            "talentBossMaterial",
            "talentBossMaterialImageUrl",
            "talentBook",
            "talentBookImageUrl",
          ])
        );
      })
      .end(done);
  });

  test("Weapon", (done) => {
    const queryData = {
      query: `query DailyRecordData {
        dailyRecordData {
          weapon {
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
        expect(Object.keys(dailyRecord.weapon)).toEqual(
          expect.arrayContaining([
            "weaponId",
            "weaponName",
            "rarity",
            "weaponType",
            "subStat",
            "weaponImageUrl",
            "weaponDomainMaterial",
            "weaponDomainMaterialImageUrl",
            "eliteEnemyMaterial",
            "eliteEnemyMaterialImageUrl",
            "commonEnemyMaterial",
            "commonEnemyMaterialImageUrl",
            "gacha",
          ])
        );
      })
      .end(done);
  });

  test("Talent", (done) => {
    const queryData = {
      query: `query DailyRecordData {
        dailyRecordData {
          talent {
            talentId
            talentName
            talentType
            talentImageUrl
            characterName
            characterImageUrl
          }
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
        expect(Object.keys(dailyRecord.talent)).toEqual(
          expect.arrayContaining([
            "talentId",
            "talentName",
            "talentType",
            "talentImageUrl",
            "characterName",
            "characterImageUrl",
          ])
        );
      })
      .end(done);
  });

  test("Constellation", (done) => {
    const queryData = {
      query: `query DailyRecordData {
        dailyRecordData {
          constellation {
            constellationId
            constellationName
            constellationLevel
            constellationImageUrl
            characterName
            characterImageUrl
          }
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
        expect(Object.keys(dailyRecord.constellation)).toEqual(
          expect.arrayContaining([
            "constellationId",
            "constellationName",
            "constellationLevel",
            "constellationImageUrl",
            "characterName",
            "characterImageUrl",
          ])
        );
      })
      .end(done);
  });

  test("Food", (done) => {
    const queryData = {
      query: `query DailyRecordData {
        dailyRecordData {
          food {
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
        expect(Object.keys(dailyRecord.food)).toEqual(
          expect.arrayContaining([
            "foodId",
            "foodName",
            "rarity",
            "foodType",
            "specialDish",
            "purchasable",
            "recipe",
            "event",
            "foodImageUrl",
          ])
        );
      })
      .end(done);
  });
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
      updateDailyRecord(id: "${validDailyRecordID}", type: Character)
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
      updateDailyRecord(id: "${validDailyRecordID}", type: Weapon)
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

test("updating the current daily record for Talent returns a success", (done) => {
  const mutationData = {
    query: `mutation UpdateDailyRecord {
      updateDailyRecord(id: "${validDailyRecordID}", type: Talent)
    }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: string = res.body.data.updateDailyRecord;
      expect(resultsMessage).toContain("Daily record updated. talent:");
    })
    .end(done);
});

test("updating the current daily record for Constellation returns a success", (done) => {
  const mutationData = {
    query: `mutation UpdateDailyRecord {
      updateDailyRecord(id: "${validDailyRecordID}", type: Constellation)
    }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: string = res.body.data.updateDailyRecord;
      expect(resultsMessage).toContain("Daily record updated. constellation:");
    })
    .end(done);
});

test("updating the current daily record for Food returns a success", (done) => {
  const mutationData = {
    query: `mutation UpdateDailyRecord {
      updateDailyRecord(id: "${validDailyRecordID}", type: Food)
    }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: string = res.body.data.updateDailyRecord;
      expect(resultsMessage).toContain("Daily record updated. food:");
    })
    .end(done);
});

test("patching the current daily record for character increases the number of time character has been solved by 1", (done) => {
  let beforeCharacterSolved: number;

  const dailyCharacterQuery = {
    query: `query DailyRecordData {
      dailyRecordData {
        characterSolved
      }
    }`,
  };

  request(app)
    .post("/graphql")
    .send(dailyCharacterQuery)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const beforeDailyRecord: { characterSolved: number } =
        res.body.data.dailyRecordData;
      beforeCharacterSolved = beforeDailyRecord.characterSolved;
    })
    .then(() => {
      const mutationData = {
        query: `mutation UpdateDailyRecord {
            updateDailyRecord(id: "${validDailyRecordID}", type: Character)
          }`,
      };

      request(app)
        .post("/graphql")
        .send(mutationData)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(() => {
          request(app)
            .post("/graphql")
            .send(dailyCharacterQuery)
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
              const afterDailyRecord: { characterSolved: number } =
                res.body.data.dailyRecordData;
              const afterCharacterSolved = afterDailyRecord.characterSolved;
              expect(afterCharacterSolved).toBe(beforeCharacterSolved + 1);
            })
            .end(done);
        });
    });
});

test("attempting to update an invalid Game Type in the daily record returns a 400 and corresponding error message", (done) => {
  const invalidGameType = "ReallyReal";
  const mutationData = {
    query: `mutation UpdateDailyRecord {
        updateDailyRecord(id: "${validDailyRecordID}", type: ${invalidGameType})
      }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(400)
    .expect((res) => {
      const resultsMessage: { message: string } = res.body.errors[0];
      expect(resultsMessage.message).toEqual(
        'Value "ReallyReal" does not exist in "GameDataType" enum.'
      );
    })
    .end(done);
});

test("attempting to update a daily record with an invalid ID (not a number) returns an error message", (done) => {
  const invalidId = "i am error";
  const mutationData = {
    query: `mutation UpdateDailyRecord {
        updateDailyRecord(id: "${invalidId}", type: Character)
      }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string } = res.body.errors[0];
      expect(resultsMessage.message).toEqual(
        "Invalid argument. Please enter an id number."
      );
    })
    .end(done);
});

test("attempting to update a nonexistent daily record returns an error message", (done) => {
  const nonexistentDailyRecordID = -1;
  const mutationData = {
    query: `mutation UpdateDailyRecord {
        updateDailyRecord(id: "${nonexistentDailyRecordID}", type: Character)
      }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string } = res.body.errors[0];
      expect(resultsMessage.message).toEqual(
        "Invalid id number. That daily record does not exist."
      );
    })
    .end(done);
});

test("attempting to update a daily record from the past returns an error message", (done) => {
  // prevents returned daily record from also having the mocked Date
  dateNowSpy.mockRestore();
  const pastDailyRecordID = 2;
  const mutationData = {
    query: `mutation UpdateDailyRecord {
        updateDailyRecord(id: "${pastDailyRecordID}", type: Character)
      }`,
  };

  request(app)
    .post("/graphql")
    .send(mutationData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const resultsMessage: { message: string } = res.body.errors[0];
      expect(resultsMessage.message).toEqual(
        "Unable to update past daily record."
      );
    })
    .end(done);
});

describe("subscription related tests", () => {
  test("an updated daily record solved value is sent via subscription after updating the daily record", (done) => {
    const wsLink = new GraphQLWsLink(
      createClient({
        url: "ws://localhost:4000",
        webSocketImpl: WebSocket,
      })
    );

    const client = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache(),
    });

    const observable = client.subscribe({
      query: gql`
        subscription DailyRecordUpdated {
          dailyRecordUpdated {
            type
            newSolvedValue
          }
        }
      `,
    });

    const mutationData = {
      query: `mutation UpdateDailyRecord {
        updateDailyRecord(id: "${validDailyRecordID}", type: Character)
      }`,
    };

    request(app)
      .post("/graphql")
      .send(mutationData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(() => {
        observable.subscribe({
          next(value) {
            expect(value.data.dailyRecordUpdated).toBeDefined();
            expect(value.data.dailyRecordUpdated.type).toBe(
              GameDataType.Character
            );
          },
        });
      })
      .end(done);
  });

  test("the updated value sent via subscription is greater than the value before the update request by 1", (done) => {
    let beforeCharacterSolved: number;

    const wsLink = new GraphQLWsLink(
      createClient({
        url: "ws://localhost:4000",
        webSocketImpl: WebSocket,
      })
    );

    const client = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache(),
    });

    const observable = client.subscribe({
      query: gql`
        subscription DailyRecordUpdated {
          dailyRecordUpdated {
            type
            newSolvedValue
          }
        }
      `,
    });

    const queryData = {
      query: `query DailyRecordData {
      dailyRecordData {
        characterSolved
      }
    }`,
    };

    const mutationData = {
      query: `mutation UpdateDailyRecord {
        updateDailyRecord(id: "${validDailyRecordID}", type: Character)
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const beforeDailyRecord: { characterSolved: number } =
          res.body.data.dailyRecordData;
        beforeCharacterSolved = beforeDailyRecord.characterSolved;
      })
      .then(() => {
        request(app)
          .post("/graphql")
          .send(mutationData)
          .expect("Content-Type", /json/)
          .expect(200)
          .expect(() => {
            observable.subscribe({
              next(value) {
                expect(value.data.dailyRecordUpdated.newSolvedValue).toBe(
                  beforeCharacterSolved + 1
                );
              },
            });
          })
          .end(done);
      });
  });
});
