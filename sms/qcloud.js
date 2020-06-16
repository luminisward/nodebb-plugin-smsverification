const winston = require.main.require('winston');
const QcloudSms = require('qcloudsms_js');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const meta = require.main.require('./src/meta');

let initSuccess = false;
let qcloudsms;
let ssender;
let appid;
let appkey;
let templateId;
let smsSign;
let templateIdIntl;
let smsSignIntl;

const sendSms = ({ nationCode = '86', phoneNumber, params }) => new Promise((resolve, reject) => {
  const intlSms = nationCode !== '86';

  ssender.sendWithParam(
    nationCode,
    [phoneNumber],
    intlSms ? templateIdIntl : templateId,
    params,
    intlSms ? smsSignIntl : smsSign,
    '',
    '',
    (err, res, resData) => {
      if (err) {
        reject(err);
      } else {
        resolve({ res, resData });
      }
    },
  );
});

const Client = {
  init: async () => {
    ({
      appid, appkey, templateId, smsSign, templateIdIntl, smsSignIntl,
    } = await meta.settings.get('smsverification'));

    if (appid && appkey && templateId && smsSign) {
      qcloudsms = QcloudSms(appid, appkey);
      ssender = qcloudsms.SmsSingleSender();
      initSuccess = true;
      winston.info('[plugins/smsverification] 初始化成功');
    } else {
      winston.warn('[plugins/smsverification] 初始化失败，设置不完整');
    }
  },
  /**
    *
    * @param {string} phoneNumber 手机号
    * @param {Array} params 短信模板对应的参数列表
    * @returns {Promise<{res, resData}>}
    */
  sendSms: async ({ phoneNumber, params }) => {
    if (initSuccess) {
      if (!phoneNumber) {
        throw new Error('手机号为空！');
      }
      winston.info(`[plugins.smsverification] sendSms({${phoneNumber}, ${params}}) Start`);

      let result;
      const phoneNumberIntl = parsePhoneNumberFromString(phoneNumber);
      if (phoneNumberIntl) {
        result = await sendSms({
          nationCode: phoneNumberIntl.countryCallingCode,
          phoneNumber: phoneNumberIntl.nationalNumber,
          params,
        });
      } else {
        result = await sendSms({ phoneNumber, params });
      }
      winston.info(`[plugins.smsverification] sendSms({${phoneNumber}, ${params}}) End`);
      return result;
    }
    winston.warn('[plugins/smsverification] 设置不完整，测试函数sendSms');
    return { resData: { result: 10000, errmsg: 'smsverification: 短信平台配置错误，无法发送' } };
  },
};


module.exports = Client;
