
import bodyParser from "body-parser";
import cors from 'cors';
import { pool } from "./config/db";
import { insLogMiddleware } from "./src/routes/query";
import Server from "./src/server";
import router from "./src/routes/router";
import { Route } from "./src/models/route";
import { User } from "./src/models/user";
// import * as foto from "./assets/logo.png";

declare global {
  module Express {
    interface Request {
      info_route: Route | null;
      user: User | null;
      has_permission: boolean | null;
    }
  }
}

const server = Server.instance;

//BodyParser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//CORS - Por el momento se permite que todos accedan a los servicios
server.app.use(cors({ origin: true, credentials: true }));
// const whitelist = ['http://localhost:4200']
// const corsOptions = {
//   origin: function (origin:any, callback:any) {
//     //log.info(origin);
//     console.log(origin);

//     //if (whitelist.indexOf(origin) !== -1) {
//     callback(null, true)
//     //} else {
//     //callback(new Error('Not allowed by CORS'))
//     //}
//   }
// }
// server.app.use(cors(corsOptions));

//Rutas
server.app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.app.use(function (req, res, next) {  
  pool.query(insLogMiddleware,[req.originalUrl,req.method,req.get('origin'),req.headers['authorization']])
  .then(result => {
    // console.log(result);
  })
  .catch(error => {
    // console.log(error);
  })
  next();
});
// server.app.use(routeValid, tokenValid, userValid, userPermissionValid);

server.app.use('/', router);

server.start(() => {
  console.log(`Se inicializa el servidor de express en ${server.port}.`);
});