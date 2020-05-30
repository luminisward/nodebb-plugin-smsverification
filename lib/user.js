const addFieldOnCreate = async (params) => {
  const { user, data } = params;
  user.mobile = data.mobile;
  return { user, data };
};

const addWhiteListField = async (params) => {
  params.whitelist.push('mobile');
  return params;
};

const addMobileEditButton = async (params) => {
  const { userslug } = params.templateData;
  params.templateData.editButtons.push({
    link: `/user/${userslug}/edit/mobile`,
    text: '更改手机号',
  });
  return params;
};


module.exports = {
  addFieldOnCreate, addWhiteListField, addMobileEditButton,
};
