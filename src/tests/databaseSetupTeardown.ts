import { AppDataSource, server } from "..";

const configSetup = async (entity: string) => {
  await AppDataSource.initialize();
  console.log(`Connected to the test Docker database for ${entity} testing.`);
};

const configTeardown = async (entity: string) => {
  await AppDataSource.destroy();
  console.log(
    `Disconnected from the test Docker database for ${entity} testing.`
  );

  server.close();
};

export { configSetup, configTeardown };
