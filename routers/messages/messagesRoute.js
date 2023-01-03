const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const getMessagesPage = require("../../controllers/messages/getMessagesPage");
const getNewMessagesPage = require("../../controllers/messages/getNewMessagesPage");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const getChatPage = require("./getChatPage");
const messagesRouter = Router();

//get message page
messagesRouter.get(
  "/messages",
  htmlResponse("Message"),
  checkLogin,
  getMessagesPage
);

//get cerate new message group page
messagesRouter.get(
  "/messages/newMessages",
  htmlResponse("Create Group Chat"),
  checkLogin,
  getNewMessagesPage
);

//get chat page
messagesRouter.get("/messages/:chatId", checkLogin, getChatPage);

module.exports = messagesRouter;
