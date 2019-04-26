// pages/status/status.js
//获取应用实例  
var app = getApp()
Page({
  data: {
    userid: '',
    status: 'audit',
    loading: false,
  },
  onShow: function (options) {
    var that = this;
    that.loading();
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    };
    that.getStatus();
  },
  goRegiste:function(){
    wx.redirectTo({
      url: '../login/login'
    })
  },
  getStatus: function(){
    var that = this;
    wx.request({
      url: app.globalData.ip +'?type=get_apply&uid=' +that.data.userid,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res){
        console.log(res);
        wx.hideToast();
        // that.alert(res.data.data.status);
        if (res.data.data.status == '0'){
          that.setData({
            status: 'audit',
          })
        }else if(res.data.data.status == '2'){
          that.setData({
            status: 'unpassed',
          })
        }else{
          wx.redirectTo({
            url: '../index/index',
          });
        }
      }
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
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/index/index',
    );
  },
})