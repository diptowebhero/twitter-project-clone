const { getAndSetCachedData } = require("../../utilities/cacheManager");

// set the apikey and limit
const apiKey = "AIzaSyC0sXym5eJQEV2mP__BkZsS47N3oXTJHis";
const clientKey = "twitter";
const lmt = 10;
const getGIFsTrending = async (req, res, next) => {
  try {
    const searchTerm = req.query.q;
    const gifsTrending = await getAndSetCachedData(
      `gifs:${searchTerm}`,
      async () => {
        const url =
          "https://tenor.googleapis.com/v2/featured?key=" +
          apiKey +
          "&client_key=" +
          clientKey +
          "&limit=" +
          lmt;
        const data = await fetch(url);
        const result = await data.json();
        return result;
      }
    );
    return res.json(gifsTrending);
  } catch (error) {
    next(error);
  }
};

const getGIFsBySearch = async (req, res, next) => {
  try {
    const searchTerm = req.query.q;
    const gifs = await getAndSetCachedData(`gifs:${searchTerm}`, async () => {
      const url =
        "https://tenor.googleapis.com/v2/search?q=" +
        searchTerm +
        "&key=" +
        apiKey +
        "&client_key=" +
        clientKey +
        "&limit=" +
        lmt;
      const data = await fetch(url);
      const result = await data.json();
      return result;
    });
    return res.json(gifs);
  } catch (error) {
    next(error);
  }
};

module.exports = { getGIFsTrending, getGIFsBySearch };
