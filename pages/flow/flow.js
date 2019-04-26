// pages/flow/flow.js
var app = getApp()
Page({
  data: {
    userid: '',
    flowImgs: [],
    tmpTitle: '',
    loading: false,
    flowType: ''
  },
  onLoad: function (options) {
    var that = this;
    var tmpTitle = options.title;
    var flowType = options.ftype;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    that.setData({
      loading: true,
      tmpTitle: tmpTitle,
      flowType: flowType,
    });
    // 设置小程序页面标题
    wx.setNavigationBarTitle({
      title: that.data.tmpTitle,
    })
  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  alert(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/index/index',
    );
  },
})