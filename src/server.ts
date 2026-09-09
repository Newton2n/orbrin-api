import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";

const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      if (config.node_env !== "development") {
        console.log("Server is running on port " + port);
      }
    });
  } catch (error) {
    await prisma.$disconnect();

    process.exit(1);
  }
}

main();
