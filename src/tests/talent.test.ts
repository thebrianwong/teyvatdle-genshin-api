import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { TalentData, TalentType } from "../generated/graphql";

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
  const talentTypeEnumValues = Object.values(TalentType);

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
        expect(talentTypeEnumValues).toContain(data.talentType);
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
        if (!travelerNames.includes(talent.characterName!)) {
          nonTravelerTalents += 1;
        } else {
          travelerTalents += 1;
        }
        if (talent.talentType === TalentType.AlternateSprint) {
          altSprintTalents += 1;
        } else if (talent.talentType === TalentType.Passive) {
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

describe("Talent query argument test suite", () => {
  test("a null filter argument returns an error", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: null) {
          talentId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;

        expect(data).toBeNull();
        expect(errors[0].message).toBe("Please enter a filter value.");
      })
      .end(done);
  });

  test("if multiple null arguments are provided, return an error", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(
          filter: { id: null, talentName: null, characterName: null, random: null }
        ) {
          talentId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;

        expect(data).toBeNull();
        expect(errors[0].message).toBe("Please enter a single filter value.");
      })
      .end(done);
  });

  test("if multiple valid arguments are provided, return an error", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(
          filter: {
            id: "1"
            talentName: "Sharpshooter"
            characterName: "Amber"
            random: true
          }
        ) {
          talentId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;

        expect(data).toBeNull();
        expect(errors[0].message).toBe("Please enter a single filter value.");
      })
      .end(done);
  });

  describe("a null argument returns an error", () => {
    test("id", (done) => {
      const queryData = {
        query: `query TalentData {
          talentData(filter: { id: null }) {
            talentId
          }
        }`,
      };

      request(app)
        .post("/graphql")
        .send(queryData)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          const response = res.body;
          const data = response.data;
          const errors = response.errors;

          expect(data).toBeNull();
          expect(errors[0].message).toBe(
            "Invalid argument. Please enter an id."
          );
        })
        .end(done);
    });

    test("talentName", (done) => {
      const queryData = {
        query: `query TalentData {
          talentData(filter: { talentName: null }) {
            talentId
          }
        }`,
      };

      request(app)
        .post("/graphql")
        .send(queryData)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          const response = res.body;
          const data = response.data;
          const errors = response.errors;

          expect(data).toBeNull();
          expect(errors[0].message).toBe(
            "Invalid argument. Please enter a talent name."
          );
        })
        .end(done);
    });

    test("characterName", (done) => {
      const queryData = {
        query: `query TalentData {
          talentData(filter: { characterName: null }) {
            talentId
          }
        }`,
      };

      request(app)
        .post("/graphql")
        .send(queryData)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          const response = res.body;
          const data = response.data;
          const errors = response.errors;

          expect(data).toBeNull();
          expect(errors[0].message).toBe(
            "Invalid argument. Please enter a character name."
          );
        })
        .end(done);
    });

    test("random", (done) => {
      const queryData = {
        query: `query TalentData {
          talentData(filter: { random: null }) {
            talentId
          }
        }`,
      };

      request(app)
        .post("/graphql")
        .send(queryData)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          const response = res.body;
          const data = response.data;
          const errors = response.errors;

          expect(data).toBeNull();
          expect(errors[0].message).toBe(
            'Invalid argument. Please set the argument "random" to "true" or "false".'
          );
        })
        .end(done);
    });
  });

  test("a non-number id returns an error", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { id: "hello" }) {
          talentId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const errors = response.errors;

        expect(data).toBeNull();
        expect(errors[0].message).toBe(
          "Invalid argument. Please enter a number."
        );
      })
      .end(done);
  });

  test("if the Talent ID exists, return the Talent", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { id: "1" }) {
          talentId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const talent = response.data.talentData[0];

        expect(talent).toHaveProperty("talentId", "1");
      })
      .end(done);
  });

  test("if the Talent ID does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { id: "14347" }) {
          talentId
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const emptyArray = response.data.talentData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the Talent name exists, return the Talent", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { talentName: "Sharpshooter" }) {
          talentName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const talent = response.data.talentData[0];

        expect(talent).toHaveProperty("talentName", "Sharpshooter");
      })
      .end(done);
  });

  test("if the Talent name does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { talentName: "Very Cool Move" }) {
          talentName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const emptyArray = response.data.talentData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("return all Talents for a given Character", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { characterName: "Amber" }) {
          talentName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const talents = response.data.talentData;

        expect(talents.length).toBeGreaterThan(1);
      })
      .end(done);
  });

  test("return an empty array if searching for Talents of a Character that doesn't exist", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { characterName: "Paimon" }) {
          talentName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const emptyArray = response.data.talentData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the random argument is set to true, return a random Talent", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { random: true }) {
          talentName
        }
      }`,
    };

    const mathRandomSpy = jest.spyOn(Math, "random").mockImplementation(() => {
      return 0;
    });

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const talent = response.data.talentData[0];

        expect(talent).toHaveProperty("talentName", "Sharpshooter");
        mathRandomSpy.mockRestore();
      })
      .end(done);
  });

  test("if the random argument is set to false, return Talent data as if no argument was provided", (done) => {
    const queryData = {
      query: `query TalentData {
        talentData(filter: { random: false }) {
          talentName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const response = res.body;
        const talents = response.data.talentData;

        expect(talents.length).toBeGreaterThan(1);
      })
      .end(done);
  });
});
