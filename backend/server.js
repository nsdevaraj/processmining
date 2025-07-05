import Hapi from "@hapi/hapi";
import router from "./routes/router.js";

const server = Hapi.server({
  port: 8000,
  host: "localhost",
  routes: {
    cors: {
      origin: ["*"], // Allow all origins
      additionalHeaders: ["cache-control", "x-requested-with"],
      additionalExposedHeaders: ["content-disposition"],
    },
  },
});

router.forEach((path) => server.route(path));

export default server;
