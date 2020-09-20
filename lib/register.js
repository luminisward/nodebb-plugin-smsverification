
const { getCode, removeCode } = require('./smsdata');

const addField = async (data) => {
  data.templateData.regFormEntry.push({
    label: '手机号码',
    html: '<input class="form-control" type="tel" placeholder="手机号，国外手机号请加国际区号" name="mobile" id="mobile" /><button id="sms-button" class="btn">发送</button>',
  });
  data.templateData.regFormEntry.push({
    label: '验证码',
    html: '<input class="form-control" type="number" placeholder="短信验证码" name="smscode" id="smscode" />',
  });
  return data;
};

const checkField = async (data) => {
  const { mobile, smscode: smscodeSubmit } = data.userData;

  if (mobile && smscodeSubmit) {
    const smscodeObj = await getCode(mobile);
    if (!smscodeObj) {
      throw new Error('请重新发送验证短信');
    }

    const smscodeLocal = smscodeObj.data;
    if (smscodeLocal !== smscodeSubmit) {
      throw new Error('短信验证码错误');
    }

    await removeCode(mobile); // 删除验证码防止被重复使用
    return data;
  }

  throw new Error('手机号或验证码为空');
};

module.exports = { addField, checkField };
