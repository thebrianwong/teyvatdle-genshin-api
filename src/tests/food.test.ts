import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { FoodData, FoodType } from "../generated/graphql";
import { redisClient } from "../redis/redis";
import {
  foodByIdKey,
  foodNameToIdKey,
  foodsByTypeKey,
  foodsKey,
} from "../redis/keys";

beforeAll(async () => {
  await configSetup("Food");
});

afterAll(async () => {
  await configTeardown("Food");
});

beforeEach(async () => {
  await redisClient
    .pipeline()
    .expireat(foodsKey(), -1)
    .expireat(foodByIdKey(), -1)
    .expireat(foodNameToIdKey(), -1)
    .expireat(foodsByTypeKey(), -1)
    .exec();
});

const queryData = {
  query: `query FoodData {
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
  }`,
};

test("return Foods as JSON", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Food keys/columns are null", (done) => {
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: FoodData[] = res.body.data.foodData;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            foodId: expect.anything(),
            foodName: expect.anything(),
            rarity: expect.anything(),
            foodType: expect.anything(),
            specialDish: expect.anything(),
            purchasable: expect.anything(),
            recipe: expect.anything(),
            event: expect.anything(),
            foodImageUrl: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("returned Food data has the correct types for values", (done) => {
  const foodTypeEnumValues = Object.values(FoodType);

  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: FoodData[] = res.body.data.foodData;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.foodId).toBe("string");
        expect(typeof data.foodName).toBe("string");
        expect(typeof data.rarity).toBe("number");
        expect(foodTypeEnumValues).toContain(data.foodType);
        expect(typeof data.specialDish).toBe("boolean");
        expect(typeof data.purchasable).toBe("boolean");
        expect(typeof data.recipe).toBe("boolean");
        expect(typeof data.event).toBe("boolean");
        expect(typeof data.foodImageUrl).toBe("string");
      });
    })
    .end(done);
});

test("return the correct number of Foods", (done) => {
  const numOfFoods = 244;

  // rarity
  const numOfOneStarFoods = 37;
  const numOfTwoStarFoods = 74;
  const numOfThreeStarFoods = 117;
  const numOfFourStarFoods = 15;
  const numOfFiveStarFoods = 1;

  // food type
  const numOfAdventuresDishes = 28;
  const numOfAttackDishes = 54;
  const numOfDefenseDishes = 36;
  const numOfEssentialOils = 7;
  const numOfPotions = 7;
  const numOfRecoveryDishes = 112;

  // booleans
  const numOfSpecialDishes = 66;
  const numOfNonSpecialDishes = 178;
  const numOfPurchasableDishes = 52;
  const numOfNonPurchasableDishes = 192;
  const numOfRecipeDishes = 222;
  const numOfNonRecipeDishes = 22;
  const numOfEventDishes = 22;
  const numOfNonEventDishes = 222;
  request(app)
    .post("/graphql")
    .send(queryData)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: FoodData[] = res.body.data.foodData;

      let oneStarFoods = 0;
      let twoStarFoods = 0;
      let threeStarFoods = 0;
      let fourStarFoods = 0;
      let fiveStarFoods = 0;

      let adventureDishes = 0;
      let attackDishes = 0;
      let defenseDishes = 0;
      let essentialOils = 0;
      let potions = 0;
      let recoveryDishes = 0;

      let specialDishes = 0;
      let nonSpecialDishes = 0;
      let purchasableDishes = 0;
      let nonPurchasableDishes = 0;
      let recipeDishes = 0;
      let nonRecipeDishes = 0;
      let eventDishes = 0;
      let nonEventDishes = 0;

      arrayOfDataObjects.forEach((food) => {
        if (food.rarity === 1) {
          oneStarFoods += 1;
        } else if (food.rarity === 2) {
          twoStarFoods += 1;
        } else if (food.rarity === 3) {
          threeStarFoods += 1;
        } else if (food.rarity === 4) {
          fourStarFoods += 1;
        } else if (food.rarity === 5) {
          fiveStarFoods += 1;
        }

        if (food.foodType === FoodType.AdventurersDishes) {
          adventureDishes += 1;
        } else if (food.foodType === FoodType.AtkBoostingDishes) {
          attackDishes += 1;
        } else if (food.foodType === FoodType.DefBoostingDishes) {
          defenseDishes += 1;
        } else if (food.foodType === FoodType.EssentialOils) {
          essentialOils += 1;
        } else if (food.foodType === FoodType.Potions) {
          potions += 1;
        } else if (food.foodType === FoodType.RecoveryDishes) {
          recoveryDishes += 1;
        }

        if (food.specialDish) {
          specialDishes += 1;
        } else {
          nonSpecialDishes += 1;
        }
        if (food.purchasable) {
          purchasableDishes += 1;
        } else {
          nonPurchasableDishes += 1;
        }
        if (food.recipe) {
          recipeDishes += 1;
        } else {
          nonRecipeDishes += 1;
        }
        if (food.event) {
          eventDishes += 1;
        } else {
          nonEventDishes += 1;
        }
      });

      expect(arrayOfDataObjects).toHaveLength(numOfFoods);

      expect(oneStarFoods).toBe(numOfOneStarFoods);
      expect(twoStarFoods).toBe(numOfTwoStarFoods);
      expect(threeStarFoods).toBe(numOfThreeStarFoods);
      expect(fourStarFoods).toBe(numOfFourStarFoods);
      expect(fiveStarFoods).toBe(numOfFiveStarFoods);

      expect(adventureDishes).toBe(numOfAdventuresDishes);
      expect(attackDishes).toBe(numOfAttackDishes);
      expect(defenseDishes).toBe(numOfDefenseDishes);
      expect(essentialOils).toBe(numOfEssentialOils);
      expect(potions).toBe(numOfPotions);
      expect(recoveryDishes).toBe(numOfRecoveryDishes);

      expect(specialDishes).toBe(numOfSpecialDishes);
      expect(nonSpecialDishes).toBe(numOfNonSpecialDishes);
      expect(purchasableDishes).toBe(numOfPurchasableDishes);
      expect(nonPurchasableDishes).toBe(numOfNonPurchasableDishes);
      expect(recipeDishes).toBe(numOfRecipeDishes);
      expect(nonRecipeDishes).toBe(numOfNonRecipeDishes);
      expect(eventDishes).toBe(numOfEventDishes);
      expect(nonEventDishes).toBe(numOfNonEventDishes);
    })
    .end(done);
});

describe("Food query argument test suite", () => {
  test("a null filter argument returns an error", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: null) {
          foodId
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
      query: `query FoodData {
        foodData(filter: { id: null, foodName: null, foodType: null, random: null }) {
          foodId
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
      query: `query FoodData {
        foodData(
          filter: {
            id: "1"
            foodName: "Aaru Mixed Rice"
            foodType: ATK_Boosting_Dishes
            random: true
          }
        ) {
          foodId
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
        query: `query FoodData {
          foodData(filter: { id: null }) {
            foodId
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

    test("foodName", (done) => {
      const queryData = {
        query: `query FoodData {
          foodData(filter: { foodName: null }) {
            foodId
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
            "Invalid argument. Please enter a food name."
          );
        })
        .end(done);
    });

    test("foodType", (done) => {
      const queryData = {
        query: `query FoodData {
          foodData(filter: { foodType: null }) {
            foodId
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
            "Invalid argument. Please enter a food type."
          );
        })
        .end(done);
    });

    test("random", (done) => {
      const queryData = {
        query: `query FoodData {
          foodData(filter: { random: null }) {
            foodId
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
      query: `query FoodData {
        foodData(filter: { id: "hello" }) {
          foodId
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

  test("if the Food ID exists, return the Food", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { id: "1" }) {
          foodId
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
        const food = response.data.foodData[0];

        expect(food).toHaveProperty("foodId", "1");
      })
      .end(done);
  });

  test("if the Food ID does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { id: "14347" }) {
          foodId
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
        const emptyArray = response.data.foodData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("if the Food name exists, return the Food", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { foodName: "Aaru Mixed Rice" }) {
          foodName
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
        const food = response.data.foodData[0];

        expect(food).toHaveProperty("foodName", "Aaru Mixed Rice");
      })
      .end(done);
  });

  test("if the Food name does not exist, return an empty array", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { foodName: "Emergency Paimon" }) {
          foodName
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
        const emptyArray = response.data.foodData;

        expect(emptyArray.length).toBe(0);
      })
      .end(done);
  });

  test("return all Foods of a given Food Type", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { foodType: Adventurers_Dishes }) {
          foodName
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
        const foods = response.data.foodData;

        expect(foods.length).toBeGreaterThan(1);
      })
      .end(done);
  });

  test("return an error if passing a value that doesn't conform to the Food Type enum", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { foodType: "Yummy Food" }) {
          foodName
        }
      }`,
    };

    request(app)
      .post("/graphql")
      .send(queryData)
      .expect("Content-Type", /json/)
      .expect(400)
      .expect((res) => {
        const response = res.body;
        const data = response.data;
        const error = response.errors;

        expect(data).toBeUndefined();
        expect(error[0].message).toBe(
          'Enum "FoodType" cannot represent non-enum value: "Yummy Food".'
        );
      })
      .end(done);
  });

  test("if the random argument is set to true, return a random Food", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { random: true }) {
          foodName
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
        const food = response.data.foodData[0];

        expect(food).toHaveProperty("foodName", '"My Way"');
        mathRandomSpy.mockRestore();
      })
      .end(done);
  });

  test("if the random argument is set to false, return Food data as if no argument was provided", (done) => {
    const queryData = {
      query: `query FoodData {
        foodData(filter: { random: false }) {
          foodName
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
        const foods = response.data.foodData;

        expect(foods.length).toBeGreaterThan(1);
      })
      .end(done);
  });
});
