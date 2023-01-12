// const { default: fetch } = require("node-fetch");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const stickerOption = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "LndyQSf4NZBRzGaUmdo_8Q",
  },
};

const getStickers = async (req, res, next) => {
  try {
    const searchTerm = req.query.q;

    const sticker = await getAndSetCachedData(
      `stickers:${searchTerm}`,
      async () => {
        const url = `https://api.stickerapi.io/v2/stickers/search?q=${searchTerm}`;
        const data = await fetch(url, stickerOption);
        const result = await data.json();
        return result;
      }
    );

    return res.json(sticker);
  } catch (error) {
    next(error);
  }
};

const getStickersTrending = async (req, res, next) => {
  try {
    const searchTerm = req.params.q;

    const sticker = await getAndSetCachedData(
      `stickers:${searchTerm}`,
      async () => {
        const url = `https://api.stickerapi.io/v2/stickers/trending`;
        const data = await fetch(url, stickerOption);
        const result = await data.json();
        return result;
      }
    );

    return res.json(sticker);
  } catch (error) {
    next(error);
  }
};
module.exports = { getStickers, getStickersTrending };
