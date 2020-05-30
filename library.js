const routesHelpers = require.main.require('./src/routes/helpers');
const SocketPlugins = require.main.require('./src/socket.io/plugins');

const controllers = require('./lib/controllers');
const socketMethods = require('./websockets');

const { addField, checkField } = require('./lib/register');
const SmsClient = require('./sms/qcloud');
const user = require('./lib/user');

const plugin = {};

plugin.init = async (params) => {
  SocketPlugins.smsverification = socketMethods;

  const { router } = params;
  const hostMiddleware = params.middleware;
  // const hostControllers = params.controllers;

  // admin route
  router.get(
    '/admin/plugins/smsverification',
    hostMiddleware.admin.buildHeader,
    controllers.renderAdminPage,
  );
  router.get('/api/admin/plugins/smsverification', controllers.renderAdminPage);
  router.get(
    '/admin/plugins/smsverificationtest',
    hostMiddleware.admin.buildHeader,
    controllers.renderAdminPage2,
  );
  router.get('/api/admin/plugins/smsverificationtest', controllers.renderAdminPage2);

  // mobile edit route
  {
    const accountMiddlewares = [
      hostMiddleware.exposeUid,
      hostMiddleware.canViewUsers,
      hostMiddleware.checkAccountPermissions,
    ];
    routesHelpers.setupPageRoute(router, '/user/:userslug/edit/mobile', hostMiddleware, accountMiddlewares, controllers.editMobile);
  }

  await SmsClient.init();
};

plugin.addAdminNavigation = async (header) => {
  header.plugins.push({
    route: '/plugins/smsverification',
    icon: 'fa-tint',
    name: 'SMS verification设置',
  });
  header.plugins.push({
    route: '/plugins/smsverificationtest',
    icon: 'fa-tint',
    name: 'SMS verification测试',
  });
  return header;
};

plugin.addField = addField;
plugin.checkField = checkField;
plugin.user = user;

module.exports = plugin;
