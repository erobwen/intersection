import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "../tsoa-build/routes.js";
import openApi from '../tsoa-build/swagger.json' with { type: "json"};

const production = process?.env?.PRODUCTION === "true";
const port = production ? 3001 : 3000;

(async () => {
  const app = express();

  // Basics
  app.use(express.json({ limit: '4000000kb' }));
  app.use(express.urlencoded({ extended: true }));

  // Headers setup
  app.use(function (_, res, next) {
    if (production) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    }

    res.setHeader(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.setHeader(`Access-Control-Allow-Headers`, `Content-Type`);
    next()
  })

  // TSOA routes
  RegisterRoutes(app);

  // Swagger auto-generate
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApi));

  // Start
  app.listen(port, () => {
    console.log(`List intersection backend listening at http://localhost:${port}/api`);
    console.log(`API definitions at http://localhost:${port}/api-docs`);
  });

})();
