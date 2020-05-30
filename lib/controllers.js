const accountHelpers = require.main.require('./src/controllers/accounts/helpers');
const controllerHelpers = require.main.require('./src/controllers/helpers');

const Controllers = {};

Controllers.renderAdminPage = (req, res/* , next */) => {
  res.render('admin/plugins/smsverification', {});
};
Controllers.renderAdminPage2 = (req, res/* , next */) => {
  res.render('admin/plugins/smsverificationtest', {});
};

Controllers.editMobile = async (req, res/* , next */) => {
  const userData = await accountHelpers.getUserDataByUserSlug(req.params.userslug, req.uid);
  if (!userData) {
    return null;
  }

  const name = '手机号';

  userData.title = `正在编辑 “${userData.username}” 的手机号码`;
  userData.breadcrumbs = controllerHelpers.buildBreadcrumbs([
    {
      text: userData.username,
      url: `/user/${userData.userslug}`,
    },
    {
      text: '[[user:edit]]',
      url: `/user/${userData.userslug}/edit`,
    },
    {
      text: name,
    },
  ]);
  res.render('account/edit/mobile', userData);
  return null;
};

module.exports = Controllers;
