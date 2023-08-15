import request from "supertest";
import { app } from "../index";
import { configSetup, configTeardown } from "./databaseSetupTeardown";
import FoodData from "../types/data/foodData.type";

beforeAll(async () => {
  await configSetup("Food");
});

afterAll(async () => {
  await configTeardown("Food");
});

test("return Foods as JSON", (done) => {
  request(app)
    .get("/api/food")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(done);
});

test("expect none of the Food keys/columns are null", (done) => {
  request(app)
    .get("/api/food")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: FoodData[] = res.body;
      expect(arrayOfDataObjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            food_id: expect.anything(),
            food_name: expect.anything(),
            rarity: expect.anything(),
            food_type: expect.anything(),
            special_dish: expect.anything(),
            purchasable: expect.anything(),
            recipe: expect.anything(),
            event: expect.anything(),
            food_image_url: expect.anything(),
          }),
        ])
      );
    })
    .end(done);
});

test("returned Food data has the correct types for values", (done) => {
  request(app)
    .get("/api/food")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: FoodData[] = res.body;
      arrayOfDataObjects.forEach((data) => {
        expect(typeof data.food_id).toBe("number");
        expect(typeof data.food_name).toBe("string");
        expect(typeof data.rarity).toBe("number");
        expect([
          "Adventurer's Dishes",
          "Recovery Dishes",
          "DEF-Boosting Dishes",
          "ATK-Boosting Dishes",
          "Potions",
          "Essential Oils",
        ]).toContain(data.food_type);
        expect(typeof data.special_dish).toBe("boolean");
        expect(typeof data.purchasable).toBe("boolean");
        expect(typeof data.recipe).toBe("boolean");
        expect(typeof data.event).toBe("boolean");
        expect(typeof data.food_image_url).toBe("string");
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
    .get("/api/food")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      const arrayOfDataObjects: FoodData[] = res.body;

      const oneStarFoods = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 1
      );
      const twoStarFoods = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 2
      );
      const threeStarFoods = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 3
      );
      const fourStarFoods = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 4
      );
      const fiveStarFoods = [...arrayOfDataObjects].filter(
        (data) => data.rarity === 5
      );

      const adventureDishes = [...arrayOfDataObjects].filter(
        (data) => data.food_type === "Adventurer's Dishes"
      );
      const attackDishes = [...arrayOfDataObjects].filter(
        (data) => data.food_type === "ATK-Boosting Dishes"
      );
      const defenseDishes = [...arrayOfDataObjects].filter(
        (data) => data.food_type === "DEF-Boosting Dishes"
      );
      const essentialOils = [...arrayOfDataObjects].filter(
        (data) => data.food_type === "Essential Oils"
      );
      const potions = [...arrayOfDataObjects].filter(
        (data) => data.food_type === "Potions"
      );
      const recoveryDishes = [...arrayOfDataObjects].filter(
        (data) => data.food_type === "Recovery Dishes"
      );

      const specialDishes = [...arrayOfDataObjects].filter(
        (data) => data.special_dish === true
      );
      const nonSpecialDishes = [...arrayOfDataObjects].filter(
        (data) => data.special_dish === false
      );
      const purchasableDishes = [...arrayOfDataObjects].filter(
        (data) => data.purchasable === true
      );
      const nonPurchasableDishes = [...arrayOfDataObjects].filter(
        (data) => data.purchasable === false
      );
      const recipeDishes = [...arrayOfDataObjects].filter(
        (data) => data.recipe === true
      );
      const nonRecipeDishes = [...arrayOfDataObjects].filter(
        (data) => data.recipe === false
      );
      const eventDishes = [...arrayOfDataObjects].filter(
        (data) => data.event === true
      );
      const nonEventDishes = [...arrayOfDataObjects].filter(
        (data) => data.event === false
      );

      expect(arrayOfDataObjects).toHaveLength(numOfFoods);

      expect(oneStarFoods).toHaveLength(numOfOneStarFoods);
      expect(twoStarFoods).toHaveLength(numOfTwoStarFoods);
      expect(threeStarFoods).toHaveLength(numOfThreeStarFoods);
      expect(fourStarFoods).toHaveLength(numOfFourStarFoods);
      expect(fiveStarFoods).toHaveLength(numOfFiveStarFoods);

      expect(adventureDishes).toHaveLength(numOfAdventuresDishes);
      expect(attackDishes).toHaveLength(numOfAttackDishes);
      expect(defenseDishes).toHaveLength(numOfDefenseDishes);
      expect(essentialOils).toHaveLength(numOfEssentialOils);
      expect(potions).toHaveLength(numOfPotions);
      expect(recoveryDishes).toHaveLength(numOfRecoveryDishes);

      expect(specialDishes).toHaveLength(numOfSpecialDishes);
      expect(nonSpecialDishes).toHaveLength(numOfNonSpecialDishes);
      expect(purchasableDishes).toHaveLength(numOfPurchasableDishes);
      expect(nonPurchasableDishes).toHaveLength(numOfNonPurchasableDishes);
      expect(recipeDishes).toHaveLength(numOfRecipeDishes);
      expect(nonRecipeDishes).toHaveLength(numOfNonRecipeDishes);
      expect(eventDishes).toHaveLength(numOfEventDishes);
      expect(nonEventDishes).toHaveLength(numOfNonEventDishes);
    })
    .end(done);
});
