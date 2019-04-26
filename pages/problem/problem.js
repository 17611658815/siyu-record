// pages/myBank/myBank.js
var app = getApp();
Page({
  data: {
     userId:'',
     problemList:[],
     paroblem:false,
     is_pay:''
  },
  onLoad: function (options) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    var userName = wx.getStorageSync('userName')
    var bankNum = wx.getStorageSync('bankNum')
    var bank = app.globalData.bank;
    var is_pay = that.data.is_pay
    var bankShow = app.globalData.bankShow;
    console.log(app)
    that.setData({
      userid: userid,
    })
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    }else{  
      is_pay = userinfo.is_pay;  //判断是否开通金钱
      console.log(is_pay)
      if (is_pay == 0) {
        that.setData({
          paroblem: true,
        })
      }else{
        that.setData({
          paroblem: false,
        })
      }
      wx.request({
        url: app.globalData.ip + '?type=ask_and_answer&uid=' + that.data.userid,
        success: function (res) {
          console.log(res)
          that.setData({
            problemList: res.data
          })
        }
      })  
    }
  },

  

})