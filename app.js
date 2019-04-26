//app.js
// const mtjwxsdk = require('./utils/mtj-wx-sdk.js')
App({
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  globalData: {
    firstGlance:0,//用户第一次浏览某页
    appname: '民福康医生',
    userInfo: {},
    max_callback: 3,
    mfk_doctor_id: 0,
    apply_id: 0,
    login:false,
    appid: '7', //填写微信小程序appid  
    ip: 'https://mfkapi.39yst.com/app/api/record_app2.php'
  },
  onLaunch: function (option) {//初始化
    var that = this;
    var pass = true;
    var timer = setInterval(function(){
    var userinfo = wx.getStorageSync('userinfo') || {};
    },2000)
  },
  alert: function (content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  
})
