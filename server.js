//dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const notFoundHandler = require("./middlewares/common/notFoundHandler");
const errorHandler = require("./middlewares/common/errorHandler");
const loginRoute = require("./routers/auth/loginRoute");
const registerRoute = require("./routers/auth/registerRoute");
const homeRouter = require("./routers/home/homeRoute");
const { redisClient } = require("./utilities/cacheManager");
const postRoute = require("./routers/APIS/postRoute");
const profileRouter = require("./routers/profile/profileRoute");
const searchRouter = require("./routers/search/searchRoute");
const userRouter = require("./routers/users/usersRoute");
const httpSocketServer = require("./socketServer");
const messagesRouter = require("./routers/messages/messagesRoute");
const chatRoute = require("./routers/chat/chatRoute");
const externalRoute = require("./routers/externalRouter/externalRoute");
const app = express();
dotenv.config();

//request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//set view engine
app.set("view engine", "pug");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//routing setup
app.use(loginRoute); //authentication route
app.use(registerRoute); //authentication route
app.use(homeRouter); //home route
app.use(postRoute); //tweet post route
app.use(profileRouter); // profile route
app.use(searchRouter); // search route
app.use(userRouter); // user route
app.use(messagesRouter); // message route
app.use(chatRoute); // chat route
app.use(externalRoute); // chat route

//notfound handler
app.use(notFoundHandler);

//default error handler
app.use(errorHandler);

//database connection & redis
redisClient.connect();
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Database connection successfully");
    });
    httpSocketServer.listen(process.env.SOCKET_PORT || 5003, () => {
      console.log(
        "Socket server listening on port " + process.env.SOCKET_PORT || 5003
      );
    });
  })
  .catch((error) => console.log(error));
