import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`[HMART API] Server running on port ${env.PORT} (${env.NODE_ENV})`);
});
