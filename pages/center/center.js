// pages/center/center.js
var app = getApp();
Page({
  data: {
    nickName: '',
    userid: '',
    userInfoAvatar: '',
    position: '',
    userPic: '',
    monay: '',
    is_pay: '',
    active: '',
    Mgtop: '',
    page: 1,
    winWidth: 0,
    winHeight: 0,
    isHide: 'none',
    loading: false,
    show: true,
    scroll: true,
    time: [],
    top: '',
    count_num:0,
    isIphoneX:false,
    chexk: false, //是否认证信息
    doctorid:'',
    userObj:{}
  },
  onLoad: function(option) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = userinfo != undefined ? userinfo.id : 0;
    var doctorid = userinfo ? userinfo.mfk_doctor_id : 0
    var userObj = wx.getStorageSync('userObj') || {}
    console.log(doctorid)
    var phone = wx.getStorageSync('phone')
    var is_pay = that.data.is_pay
    console.log(app)
    if (userid == 0) {
      wx.redirectTo({
        url: '../login/login',
      })
    } else {
      var that = this;
      that.getMonayList()
      is_pay = userinfo.is_pay;
     
        that.setData({
          userid: userid,
          userObj: userObj
        });
      
      wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          if (res.model.search('iPhone X') != -1) {
            console.log('iPhone X')
            that.setData({
              isIphoneX:true
            })
          }
          that.setData({
            windowHeight: res.windowHeight / res.windowWidth * 750 - 150,
            windowWidth: res.windowWidth
          });
        }
      })
        that.getDocterMsg(phone)
     
    }

  },
  goCertification() {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  getDoctorStatus(){
    var that =this
    if (that.data.userid == undefined) {
      app.alert("您的资质正在审核中,暂无法跳转主页")
      return
    }else{
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getDoctorInfo/',
        data: {
          appid: app.globalData.appid,
          userid: that.data.userid
        },
        header: {
          'content-type': 'application/json'
        },
        method: "POST",
        success: (res) => {
          console.log(res)
          that.setData({
            count_num: res.data.data.count_num 
          })
          // if (res.data.data.count_num > 0) {
          //   wx.navigateToMiniProgram({
          //     appId: 'wxd8fd4122d8ed38e9',
          //     path: 'pages/doctorHomePage/doctorHomePage?doctorId=' + that.data.doctorid,
          //     extraData: {},
          //     envVersion: 'trial',
          //     success(res) {
          //       // 打开成功
          //       console.log('打开了')
          //     }
          //   })
          // } else {
          //   app.alert("您的信息正在")
          // }
        }
      })
    }
    
  },
  // 跳转民福康小程序
  gomfk() {
    wx.navigateToMiniProgram({
      appId: 'wxd8fd4122d8ed38e9',
      path: 'pages/doctorHomePage/doctorHomePage?doctorId=' + that.data.doctorid,
      extraData: {},
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log('打开了')
      }
    })
  },
  // 获取医生信息
  getDocterMsg(phone) {
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
      method: 'GET',
      success: (res) => {
        
        that.setData({
          cooperation: res.data.msg.cooperation,
          nickName: res.data.msg.name,
          userInfoAvatar: res.data.msg.avatar
        })
       
      }
    })
  },
  // 下拉退出登录
  PullDownRefresh: function() {
    var that = this;
    app.globalData.user = ''
   wx.clearStorage()
    wx.showLoading({
      title: '退出中..',
    })
    setTimeout(function() {
      wx.hideLoading()
      // 清理成功toast
      that.setData({
        isHide: 'block',
      });
      setTimeout(function() {
        that.setData({
          isHide: 'none',
        })
        wx.redirectTo({
          url: '../login/login',
        })
      }, 2000);
    }, 2000)
  },
  gomayInformation() {
    wx.navigateTo({
      url: '/pages/mayinformation/mayinformation',
    })
  },
  //拨打客服
  callUp(){
    wx.makePhoneCall({
      phoneNumber: '01059231588' // 仅为示例，并非真实的电话号码
    })
  },
  //获取收益
  getMonayList() {
    var that = this;
    wx.request({
      url: app.globalData.ip + '?type=earnings&uid=' + that.data.userid,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        that.setData({
          monay: res.data,
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  goHome: function() {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  goMoney: function() {
    wx.navigateTo({
      url: '../money/money',
    })
  },
  goEdit: function() {
    wx.navigateTo({
      url: '../editInfo/editInfo',
    })
  },
  gofeedback: function() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  gotextAsk: function() {
    wx.navigateTo({
      url: '../textAsk/textAsk',
    })
  },
  goanswer: function() {
    wx.navigateTo({
      url: '../answer/answer',
    })
  },
  goAskLIst: function() {
    wx.navigateTo({
      url: '../askList/askList',
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
  loading: function() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
  },
  //分享页面 
  onShareAppMessage: function() {
    var that = this;
    return {
      title: "民福康医生-个人中心",
      path: '/pages/ask/ask',
    }
  },
})