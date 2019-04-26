// pages/Videoappointments/Videoappointments.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    ishide: 'none', //模态窗口
    videoList: [],
    doctorInfo: {},
    userid: '',
    cooperation:'11',
    code: true,
    code2: true,
    err: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    var phone = wx.getStorageSync('phone')
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    if (userinfo == null) {
      wx.redirectTo({
        url: '../login/login',
      })
    } else if (userinfo != undefined && userinfo.mfk_doctor_id == undefined) { //信息审核中
      that.getCode(phone)
      console.log('111')
    } else {
      that.setData({
        userid: userid
      })
    }
   
    that.getDocterMsg(phone)
    that.getVideoList()
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
        console.log(res)
        that.setData({
          doctorInfo: res.data.msg,
          cooperation: res.data.msg.cooperation
        })
        console.log(that.data.doctorInfo)
      }
    })
  },
  // 重新上传三证
  goUploadagain: function () {
    wx.navigateTo({
      url: '../Uploadagain/Uploadagain',
    })
  },
  //判断登录状态
  getCode(phone) {
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/checkExpertStatus/',
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

        if (res.data.code == 301) {
          that.setData({
            code: false,
          })
          //  var obj = { "id": "1092", "wx_avatar": "", "wx_nick": "徐立峰", "sex": "1", "wx_openid": "", "province": "", "country": "", "city": "", "app_id": "5", "source": "0", "share_source": "0", "created": "1542783391", "mfk_doctor_id": "301", "is_pay": "1" }
          //   app.globalData.user = obj;
          //   console.log(app.globalData.user)
          //   wx.setStorageSync("userinfo", obj);
          //   that.onLoad()
          console.log('审核中')
        } else if (res.data.code == 200) {
          console.log("成功")
          app.globalData.user = res.data.msg;
          console.log(app.globalData.user)
          wx.setStorageSync("userinfo", app.globalData.user);
          that.onLoad()
        } else if (res.data.code == 302) {
          console.log('审核失败')
          that.setData({
            code2: false,
            err: res.data.msg
          })
        } else if (res.data.code == 500) {
          app.globalData.user = ''
          wx.removeStorageSync('userinfo')
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      }
    })
  },
  //预约拍摄

  appointment() {
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveDoctorAppointment/',
      data: {
        appid: app.globalData.appid,
        userid: that.data.userid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        this.setData({
          ishide: 'none',
        })
        app.alert(res.data.msg)
      }
    })
  },
  getVideoList() {

    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getHotVideoList/',
      data: {
        appid: app.globalData.appid,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          videoList: res.data.data,
        })
      }
    })
  },
  goVideo(e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/video/video?videoId=' + id,
    })
  },
  addApply() {
    console.log(this.data.userid)
    if (this.data.userid == undefined){
      app.alert("您的资质正在审核中,暂无法预约拍摄")
      return
    }else{
      this.setData({
        ishide: 'block',
      })
    }
  },
  goCertification() {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  //取消预约
  deselect() {
    this.setData({
      ishide: 'none',
    })
  },
  //提交申请
  submit() {
    this.appointment()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  loadMore() {
    this.setData({
      isShow: false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    return {
      title: "民福康医生-视频拍摄",
      path: '/pages/Videoappointments/Videoappointments',
    }
  }
})