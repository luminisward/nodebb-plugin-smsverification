const db = require.main.require('./src/database');
const winston = require.main.require('winston');


const getObjKey = mobile => `smsverification:${mobile}`;

const getCode = async (mobile) => {
  const key = getObjKey(mobile);
  const codeObj = await db.getObject(key);
  if (codeObj) {
    const expireTime = (new Date(codeObj.expireAt)).getTime();
    if (expireTime - Date.now() <= 0) { // 已过期
      db.objectCache.del(key); // 删除nodebb自带的LRU缓存数据
      return null;
    }
  }
  return codeObj;
};

const setCode = async (mobile, smsCode, expireSeconds) => {
  const key = getObjKey(mobile);
  await db.set(key, smsCode);
  await db.expire(key, expireSeconds);
  winston.info(`[plugins.smsverification] setCode() ${key} ${smsCode} ${expireSeconds}`);
};

const removeCode = async (mobile) => {
  const key = getObjKey(mobile);
  await db.delete(key);
};

module.exports = { getCode, setCode, removeCode };
