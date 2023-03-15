/* globals $, app, socket, define */

define('admin/plugins/smsverificationtest', ['settings'], () => {
  const ACP = {};
  $('#submitBtn').click(async () => {
    const data = {
      mobile: $('#mobile').val(),
      smscode: $('#smscode').val(),
    };
    try {
      await socket.emit('plugins.smsverification.sendTestSms', data);
      app.alertSuccess('发送成功');
    } catch (error) {
      app.alertError(error.message);
    }
  });

  return ACP;
});
