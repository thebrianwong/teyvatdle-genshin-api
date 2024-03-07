import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { FoodData } from "../generated/graphql";

beforeAll(async () => {
  await configSetup("Food");
});

afterAll(async () => {
  await configTeardown("Food");
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
        expect([
          "Adventurers_Dishes",
          "Recovery_Dishes",
          "DEF_Boosting_Dishes",
          "ATK_Boosting_Dishes",
          "Potions",
          "Essential_Oils",
        ]).toContain(data.foodType);
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

        if (food.foodType === "Adventurers_Dishes") {
          adventureDishes += 1;
        } else if (food.foodType === "ATK_Boosting_Dishes") {
          attackDishes += 1;
        } else if (food.foodType === "DEF_Boosting_Dishes") {
          defenseDishes += 1;
        } else if (food.foodType === "Essential_Oils") {
          essentialOils += 1;
        } else if (food.foodType === "Potions") {
          potions += 1;
        } else if (food.foodType === "Recovery_Dishes") {
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
