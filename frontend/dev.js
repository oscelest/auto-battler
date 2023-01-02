require("dotenv").config({path: "../.env"});
require("next/dist/cli/next-dev").nextDev(["-p", +(process.env.SERVER_FRONTEND_PORT || 3000)]);
