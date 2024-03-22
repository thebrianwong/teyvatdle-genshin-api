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

describe("Constellation query argument test suite", () => {
  test("a null filter argument returns an error", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: null) {
          constellationId
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
      query: `query ConstellationData {
        constellationData(
          filter: { id: null, constellationName: null, characterName: null, random: null }
        ) {
          constellationId
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
      query: `query ConstellationData {
        constellationData(
          filter: { id: 1, constellationName: "One Arrow to Rule Them All", characterName: "Amber", random: true }
        ) {
          constellationId
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
        query: `query ConstellationData {
          constellationData(filter: { id: null }) {
            constellationId
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

    test("constellationName", (done) => {
      const queryData = {
        query: `query ConstellationData {
          constellationData(filter: { constellationName: null }) {
            constellationId
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
            "Invalid argument. Please enter a constellation name."
          );
        })
        .end(done);
    });

    test("characterName", (done) => {
      const queryData = {
        query: `query ConstellationData {
          constellationData(filter: { characterName: null }) {
            constellationId
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
        query: `query ConstellationData {
          constellationData(filter: { random: null }) {
            constellationId
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
      query: `query ConstellationData {
        constellationData(filter: { id: "hello" }) {
          constellationId
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

  test("if the Constellation ID exists, return the Constellation", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { id: "1" }) {
          constellationId
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
        const constellation = response.data.constellationData[0];

        expect(constellation).toHaveProperty("constellationId", "1");
      })
      .end(done);
  });

  test("if the Constellation ID does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { id: "14347" }) {
          constellationId
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
        const emptyArray = response.data.constellationData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the Constellation name exists, return the Constellation", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { constellationName: "One Arrow to Rule Them All" }) {
          constellationName
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
        const constellation = response.data.constellationData[0];

        expect(constellation).toHaveProperty(
          "constellationName",
          "One Arrow to Rule Them All"
        );
      })
      .end(done);
  });

  test("if the Constellation name does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { constellationName: "Very Real Name" }) {
          constellationName
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
        const emptyArray = response.data.constellationData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the Character name exists, return the Character", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { characterName: "Amber" }) {
          characterName
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
        const constellation = response.data.constellationData[0];

        expect(constellation).toHaveProperty("characterName", "Amber");
      })
      .end(done);
  });

  test("if the Character name does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { characterName: "Paimon" }) {
          characterName
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
        const emptyArray = response.data.constellationData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the random argument is set to true, return a random Constellation", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { random: true }) {
          constellationName
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
        const constellation = response.data.constellationData[0];

        expect(constellation).toHaveProperty(
          "constellationName",
          "One Arrow to Rule Them All"
        );
        mathRandomSpy.mockRestore();
      })
      .end(done);
  });

  test("if the random argument is set to false, return Constellation data as if no argument was provided", (done) => {
    const queryData = {
      query: `query ConstellationData {
        constellationData(filter: { random: false }) {
          constellationId
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
        const constellations = response.data.constellationData;

        expect(constellations.length).toBeGreaterThan(1);
      })
      .end(done);
  });
});
