const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const {
  getStickers,
  getStickersTrending,
} = require("../../controllers/externalApi/getStickers");
const externalRoute = Router();

externalRoute.get("/external/stickers/search", checkLogin, getStickers);
externalRoute.get("/external/trending", checkLogin, getStickersTrending);

module.exports = externalRoute;
