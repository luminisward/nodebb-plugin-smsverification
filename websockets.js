const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const user = require.main.require('./src/user');

const { getCode, setCode, removeCode } = require('./lib/smsdata');
const SmsClient = require('./sms/qcloud');

const makeSmsCode = (length) => {
  let result = '';
  for (let index = 0; index < length; index += 1) {
    const n = Math.floor(Math.random() * 10);
    result += n.toString();
  }
  return result;
};

const methods = {
  async sendCode(socket, data) {
    const expireSeconds = await meta.settings.getOne('smsverification', 'expireSeconds') || 60;
    const { mobile } = data;

    // 检测该号码是否已发
    const existCode = await getCode(mobile);
    if (existCode) {
      const expire = (new Date(existCode.expireAt)).getTime();
      return { expire, newSms: false };
    }

    const smsCode = makeSmsCode(4); // 生成验证码
    const { resData } = await SmsClient.sendSms({ phoneNumber: data.mobile, params: [smsCode] });
    // const resData = { result: 0 }; // 本地测试发送短信假数据
    if (resData && resData.result === 0) { // 发送成功
      await setCode(mobile, smsCode, expireSeconds);
      const expire = Date.now() + (expireSeconds * 1000);
      return { expire, newSms: true };
    }

    winston.error(`[plugins.smsverification] sendSms() Result Error {result, errmsg}: ${resData.result} ${resData.errmsg}`);
    throw new Error(resData.errmsg);
  },
  async editMobile(socket, data) {
    const { uid, mobile, smscode } = data;

    if (!mobile || !smscode) {
      throw new Error('请填写手机号和验证码');
    }

    // 检测该号码是否已发
    const existCode = await getCode(mobile);
    if (!existCode) {
      throw new Error('请发送短信验证码');
    }

    if (existCode && existCode.data === smscode) {
      await removeCode(mobile);
      await user.setUserField(uid, 'mobile', mobile);
      return;
    }

    throw new Error('验证码错误');
  },
  async sendTestSms(socket, data) {
    const isAdmin = await user.isAdministrator(socket.uid);
    if (!isAdmin) {
      throw new Error('[[error:no-privileges]]');
    }

    const { mobile, smscode } = data;

    const { resData } = await SmsClient.sendSms({ phoneNumber: mobile, params: [smscode] }); // 发送短信
    if (resData && resData.result === 0) { // 发送成功
      return;
    }

    winston.error(`[plugins.smsverification] sendSms() Result Error {result, errmsg}: ${resData.result} ${resData.errmsg}`);
    throw new Error(resData.errmsg);
  },
};

module.exports = methods;
