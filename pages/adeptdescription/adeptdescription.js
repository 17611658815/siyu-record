// pages/feedback/feedback.js
var app = getApp();
Page({
  data: {
    docinfo:{},
    message: '',
  },
  onLoad: function (options) {
    var that = this
    var userinfo = wx.getStorageSync('userinfo') || {};
    var phone = wx.getStorageSync('phone')
    that.getDocterMsg(phone)
  },
  getDocterMsg(phone) {
    var that = this
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertInfo/',
      data: {
        appid: app.globalData.appid,
        phone: phone
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        that.setData({
          docinfo: res.data.msg,
          message: res.data.msg.describe
        })
        console.log(that.data.docinfo)
      }
    })
  },
  submitMsg() {
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveExpertInfo/',
      data: {
        appid: app.globalData.appid,
        name: that.data.docinfo.name,
        mobile: that.data.docinfo.mobile,
        hospital: that.data.docinfo.hospital,
        department: that.data.docinfo.department,
        adept: that.data.docinfo.adept,
        identity_code: that.data.docinfo.identity_code,
        title: that.data.docinfo.title,
        qualification: that.data.docinfo.qualification,
        qualification2: that.data.docinfo.qualification2,
        cooperation: that.data.docinfo.cooperation,
        identity: that.data.docinfo.identity,
        identity2: that.data.docinfo.identity,
        doctor_rank: that.data.docinfo.doctor_rank,
        describe: that.data.message
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        that.setData({
          message:''
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })

  },
  savemessage: function (e) {
    var that = this;
    that.setData({
      message: e.detail.value
    })
  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  
})

