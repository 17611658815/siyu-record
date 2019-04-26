// pages/login/login.js
var app = getApp();
Page({
  data: {
    tapTime: "",
    num: 60,
    phone: '',
    pwd: '',
    noSend: true,
    agree: true,
    errorMsg: '', //错误信息
    isHide: 'none',
  },
  onLoad: function() {
    var that = this;
  },
  goqianzi() {
    wx.navigateTo({
      url: '/pages/signature/signature',
    })
  },
  savePhone: function(e) {
    var that = this;
    var phone = that.data.phone;

    that.setData({
      phone: e.detail.value
    })
    console.log(that.data.phone);
  },
  savePwd: function(e) {
    var that = this;
    var pwd = that.data.pwd;
    that.setData({
      pwd: e.detail.value
    })
  },
  // 检测手机号码
  checkPhone: function(phone) {
    var that = this;
    if (phone.length == 0) {
      that.alert("请输入手机号");
      return false;
    }
    if (phone.length != 11) {
      that.alert("手机号长度有误！");
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      that.alert("手机号有误！")
      return false;
    }
    return true;
  },
  // 检测密码不为空
  checkCode: function(pwd) {
    var that = this;
    if (pwd.length == 0) {
     
      that.alert("请输入验证码！");
      return false;
    }

    return true;
  },
  // 验证真实姓名
  /** 
  checkName: function(name){
    var that = this;
    if (name.length == 0) {
      that.setData({
        isHide: 'block',
        errorMsg: '请输入您的名字',
      });
      setTimeout(function () {
        that.setData({
          isHide: 'none',
        })
      }, 2000);
      // that.alert("请输入您的名字！")
      return false;
    }
    return true;
  },
  */
  checkAgree: function(agree) {
    var that = this;
    if (agree == false) {
      that.alert("您还没同意用户协议哦！")
      return false;
    }
    return true;
  },
//校验手机号
  sendCode: function() {
    var that = this;
    var num = that.data.num;
    var phone = that.data.phone;
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/common/checkExpertPhone/',
      data: {
        appid: app.globalData.appid,
        phone: that.data.phone
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 500) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            confirmText: '立即注册',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/register/register',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          that.getCode()
        }
      }
    })
  },
  getCode() {
    var that = this;
    var num = that.data.num;
    var phone = that.data.phone;
    if (that.checkPhone(phone)) {
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/user/sendSmsCode',
        data: {
          appid: app.globalData.appid,
          phone: that.data.phone,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data);
          if (res.data.code == 500) {
            app.alert(res.data.msg)
          } else {
            that.setData({
              noSend: false
            });
            that.data.timer = setInterval(function() {
              num--;
              that.setData({
                num: num,
              });
              if (that.data.num == 0) {
                clearInterval(that.data.timer);
                that.setData({
                  num: 60,
                  noSend: true
                });
              }
            }, 1000);
          }
        },
        fail: function(res) {
          console.log('is failed');
          that.alert(res.data);
        }
      })
    }
  },
  //注册
  goRegister() {
    var that = this
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  checkboxChange: function() {
    var that = this;
    that.setData({
      agree: !that.data.agree
    })
    console.log(that.data.agree);
  },
  goAgreement: function() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },
  // 提交
  submit: function() {
    var that = this;
    var phone = that.data.phone;
    var pwd = that.data.pwd;
    wx.setStorage({
      key: 'phone',
      data: phone,
    })
    console.log(pwd)
    var agree = that.data.agree;
    if (that.checkAgree(agree) && that.checkPhone(phone) && that.checkCode(pwd)) {
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/user/expertPhoneSmsLogin',
        data: {
          appid: app.globalData.appid,
          phone: phone,
          code: pwd
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function(res) {
          console.log(res.data)
          if (res.data.code == 501) {
            console.log("失败")
            app.alert(res.data.msg);
            return
          } else if (res.data.code == 500) {
            console.log("失败")
            app.alert(res.data.msg);

          } else if (res.data.code == 301) {
            wx.setStorageSync("userinfo", phone);
            wx.setStorageSync("uid", res.data.user.id)
            wx.redirectTo({
              url: '../index/index?phone=' + phone,
            })

          } else {
            console.log("成功")
            app.globalData.user = res.data.msg;
            console.log(app.globalData.user)
            // wx.setStorageSync("phone", app.globalData.user.mobile);
            wx.setStorageSync("userinfo", app.globalData.user);
            wx.redirectTo({
              url: '../index/index',
            })
          }
        },
        fail: function(res) {
          console.log(res.data);
          console.log('is failed');
        }
      })
    }
  },


  alert(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  loading: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  //分享页面 
  onShareAppMessage: function() {
    var that = this;
    return {
      title: "民福康医生登录",
      path: '/pages/login/login',
    }
  },
})