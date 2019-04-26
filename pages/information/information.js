// pages/myBank/myBank.js
var app = getApp();
Page({
  
  data: {
      userid:'',
      msgList:[]
  },
  onLoad: function (options) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    var userName = wx.getStorageSync('userName')
    var bankNum = wx.getStorageSync('bankNum')
    var bank = app.globalData.bank;
    var bankShow = app.globalData.bankShow;
    if (userid == 0) {
     
    }
    that.setData({
      userid: userid,
    })
    var that = this
    // 进入页面直接调用请求
    wx.request({
      url: app.globalData.ip +'?type=sys_message&uid=' + that.data.userid,
      success: function (res) {
        console.log(res)
        that.setData({
          msgList: res.data
        })
      }
    })  
  },
 
})