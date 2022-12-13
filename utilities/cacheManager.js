const { createClient } = require("redis");
const redisClient = createClient();
const cachedDataExpiredTime = 604000; // 1day

async function getAndSetCachedData(key, cb) {
  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      const newData = await cb();
      redisClient.setEx(key, cachedDataExpiredTime, JSON.stringify(newData));
      return newData;
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateCached(key, value) {
  try {
    redisClient.setEx(key, cachedDataExpiredTime, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

//delete cache
const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  redisClient,
  getAndSetCachedData,
  updateCached,
  deleteCache,
};
