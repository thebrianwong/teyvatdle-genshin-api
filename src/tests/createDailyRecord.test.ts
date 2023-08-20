import { configSetup, configTeardown } from "./databaseSetupTeardown";
import { createDailyRecord } from "../controllers/teyvatdleGameDataController";

beforeAll(async () => {
  await configSetup("create daily record");
});

afterAll(async () => {
  await configTeardown("create daily record");
});

let dateNowSpy: jest.SpyInstance;

beforeEach(() => {
  const testDate = new Date("2000-01-01T12:00:00-08:00");
  dateNowSpy = jest.spyOn(global, "Date").mockImplementation(() => {
    return testDate;
  });
});

afterEach(() => {
  dateNowSpy.mockRestore();
});

test("calling createDailyRecord creates a new daily record", async () => {
  const logSpy = jest.spyOn(console, "log");

  await createDailyRecord();

  expect(logSpy).toHaveBeenCalledWith("A new daily record has been created.");
});
