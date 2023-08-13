import { AppDataSource, server } from "..";

const configSetup = async (entity: string) => {
  await AppDataSource.initialize();
  console.log(`Connected to the test Docker database for ${entity} testing.`);
};

const configTeardown = async (entity: string) => {
  await AppDataSource.destroy();
  console.log(
    `Disconnected from the test Docker database at the end of ${entity} testing.`
  );

  server.close();
  console.log(
    `Disconnected from the HTTP server at the end of ${entity} testing.`
  );
};

export { configSetup, configTeardown };
