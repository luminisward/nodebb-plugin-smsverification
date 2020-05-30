<form role="form" class="smsverification-settings">
  <div class="row">
    <div class="col-sm-2 col-xs-12 settings-header">腾讯云短信平台</div>
    <div class="col-sm-10 col-xs-12">
      <div class="form-group">
        <label for="appid">短信应用 SDK AppID</label>
        <input type="number" id="appid" name="appid" class="form-control" placeholder="appid">
      </div>
      <div class="form-group">
        <label for="appkey">短信应用 SDK AppKey</label>
        <input type="text" id="appkey" name="appkey" class="form-control" placeholder="appkey">
      </div>
      <div class="form-group">
        <label for="templateId">短信模板 ID，需要在短信控制台中申请</label>
        <input type="number" id="templateId" name="templateId" class="form-control" placeholder="templateId">
      </div>
      <div class="form-group">
        <label for="smsSign">签名，签名参数使用的是`签名内容`，而不是`签名ID`</label>
        <input type="text" id="smsSign" name="smsSign" class="form-control" placeholder="smsSign">
      </div>
    </div>
  </div>
  <br>

  <div class="row">
    <div class="col-sm-2 col-xs-12 settings-header">其他</div>
    <div class="col-sm-10 col-xs-12">
      <div class="form-group">
        <label for="expireSeconds">验证码过期时间（秒） 默认60秒</label>
        <input type="number" id="expireSeconds" name="expireSeconds" class="form-control" placeholder="60">
      </div>
    </div>
  </div>
</form>

<button id="save"
  class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
  <i class="material-icons">save</i>
</button>
