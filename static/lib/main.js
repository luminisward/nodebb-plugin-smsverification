/* globals document, $, window, socket, app, ajaxify */

$(document).ready(() => {
  $(window).on('action:ajaxify.end', (_, { url }) => {
    const isEditMobilePage = /^user\/.*\/edit\/mobile/.test(url);

    // 注册
    if (url === 'register' || isEditMobilePage) {
      let originMobile; // 修改时，比较原号码
      if (isEditMobilePage) {
        originMobile = $('#mobile').val();
      }

      const btnEl = $('#sms-button');
      btnEl.click(async (event) => {
        event.preventDefault();
        const mobile = $('#mobile').val().trim();
        if (originMobile === mobile) {
          app.alertError('提交的手机号与之前相同');
          return;
        }

        btnEl.attr('disabled', true);
        try {
          const { expire, newSms } = await socket.emit('plugins.smsverification.sendCode', { mobile });
          let countdown = Math.round((expire - Date.now()) / 1000);

          if (newSms) {
            app.alert({
              type: 'success',
              title: '短信验证',
              message: '验证码已发送',
              timeout: 5000,
            });
          } else {
            app.alert({
              type: 'info',
              title: '短信验证',
              message: `若未收到短信，请等待${countdown}秒后重新发送`,
              timeout: 5000,
            });
          }

          const intervalObj = setInterval(() => {
            if (countdown < 0) {
              clearInterval(intervalObj);
              btnEl.text('发送').removeAttr('disabled');
              return;
            }
            btnEl.text(`已发送 ${countdown}s`);
            countdown = Math.round((expire - Date.now()) / 1000);
          }, 1000);
        } catch (e) {
          btnEl.removeAttr('disabled');
          app.alert({
            type: 'danger',
            title: '短信验证',
            message: e.message,
            timeout: 5000,
          });
        }
      });
    }

    // 修改号码提交
    if (isEditMobilePage) {
      const submitEl = $('#submitBtn');
      submitEl.click(async (event) => {
        event.preventDefault();

        const userData = {
          uid: $('#inputUID').val(),
          mobile: $('#mobile').val(),
          smscode: $('#smscode').val(),
        };

        submitEl.addClass('disabled').find('i').removeClass('hide');
        try {
          await socket.emit('plugins.smsverification.editMobile', userData);
          ajaxify.go(`user/${ajaxify.data.userslug}/edit`);
        } catch (e) {
          submitEl.removeClass('disabled').find('i').addClass('hide');
          app.alertError(e.message);
        }
      });
    }
  });
});
