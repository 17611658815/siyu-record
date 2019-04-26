// pages/nextStep/nextStep.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [], //照片
    imgs2: [], //身份证
    imgs3: [], //执业证
    imgs4: [], //职称证
    tempFilePaths: {}, //本地图片地址对象
    imgString: '', //图片拼接后的字符串
    canChoose: true, //是否可选图片
    docInfo: {
      userPic: '',
      idcard: [],
      zhiyezheng: [],
      zhicheng: '',
      self_video: '', //认证视频
      xyImg: ''
    },
    showModel: false,
    isY: true,
    windowHeight: "",
    windowWidth: "",
    docInfo2: wx.getStorageSync('docInfo') || {},
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userinfo = wx.getStorageSync('userinfo') || {};
    var phone = wx.getStorageSync('phone') || ''
    if (JSON.stringify(userinfo) == "{}") {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
    console.log(this.data.docInfo2)

    that.getDocterMsg(phone)

    console.log(that.data.docInfo)
  },
  onShow() {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    })
  },
  // 获取信息
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
      method: 'POST',
      success: (res) => {
        console.log(res)
        that.setData({
          'imgs[0]': res.data.msg.avatar, //头像
          'imgs2[0]': res.data.msg.identity, //身份证
          'imgs2[1]': res.data.msg.identity2,
          'imgs4[0]': res.data.msg.title,  //职称证
          'docInfo.xyImg': res.data.msg.cooperation,
          name: res.data.msg.name,
          imgs3: res.data.msg.qualification.split(","),  //执业证
          'docInfo.self_video': res.data.msg.self_video,
        })
        console.log(that.data.docInfo.self_video)
      }
    })
  },

  gosignature() {
    wx.navigateTo({
      url: '/pages/signature/signature',
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "民福康医生-资质认证",
      path: '/pages/identification/identification',
    }
  },
})