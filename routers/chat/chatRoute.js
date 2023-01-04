const { Router } = require("express");
const createChat = require("../../controllers/APIS/createChat");
const getAllChat = require("../../controllers/APIS/getAllChat");
const getSingleChat = require("../../controllers/APIS/getSingleChat");
const checkLogin = require("../../controllers/auth/checkLogin");

const chatRoute = Router();

chatRoute.get("/chat", checkLogin, getAllChat);
chatRoute.post("/chat", checkLogin, createChat);
chatRoute.get("/chat/:chatId", checkLogin, getSingleChat);

module.exports = chatRoute;
