const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const {
  getGIFs,
  getGIFsTrending,
  getGIFsBySearch,
} = require("../../controllers/externalApi/getGIFs");
const {
  getStickers,
  getStickersTrending,
} = require("../../controllers/externalApi/getStickers");
const externalRoute = Router();

//get sticker
externalRoute.get("/external/stickers/search", checkLogin, getStickers);
externalRoute.get("/external/trending", checkLogin, getStickersTrending);

//get GIFs
externalRoute.get("/external/gifs/trending", checkLogin, getGIFsTrending);
externalRoute.get("/external/gifs/search", checkLogin, getGIFsBySearch);

module.exports = externalRoute;
