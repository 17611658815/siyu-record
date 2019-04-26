//index.js  
//获取应用实例  
var app = getApp()
Page({
  data: {
    userid: '',
    cooperation:'11',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    durations: 500,
    menuType: [],
    goodHeight: 88,
    windowHeight: "",
    windowWidth: "",
    show:true,
    iphoneX:true,
    autoHeight:''
  },
  onShow() {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    var phone = wx.getStorageSync('phone')
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    that.getDocterMsg(phone) 
    wx.getSystemInfo({
      success: (res) => {
        let windowHeights = (res.windowHeight * (750 / res.windowWidth)); 
        console.log(res)
        if (res.model.search('iPhone X') != -1){
          console.log('iPhone X')
          that.setData({
            iphoneX:false
          })
        }
        that.setData({
          windowHeight: res.windowHeight/res.windowWidth  * 750 - 150,
          windowWidth: res.windowWidth,
        });
      }
    })
  },
  //判断userId是否过期抓取信息
  onLoad: function() {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    var phone = wx.getStorageSync('phone')
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    if (userinfo == null) {  //判断登录信息
      that.setData({show:false})
      wx.redirectTo({
        url: '../login/login',
      })
    } else if (userinfo != undefined && userinfo.mfk_doctor_id == undefined) { // 有登录信息 信息审核中
    console.log('有信息')
      that.getCode(phone)
    } else {
      that.setData({
        userid: userid
      })
    }
  },
  //判断登录状态
  getCode(phone) {
    var that = this
    wx.request({
      url:'https://mfkapi.39yst.com/appInterface/mfkdoctor/checkExpertStatus/',
      data:{
        appid:app.globalData.appid,
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
            code: false
          })
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
        } else if (res.data.code == 500){
          app.globalData.user = ''
          wx.removeStorageSync('userinfo')
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
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
      method: 'POST',
      success: (res) => {
        console.log(res)
       that.setData({
         cooperation: res.data.msg.cooperation || ''
       })
        console.log(res.data.msg.cooperation)
      }
    })
  },
  //有声问答
  goAudioList(){
   wx.navigateTo({
     url: '/pages/audioList/audioList',
   })
  },
  //自问自答
  goAsk() {
    // app.alert('666')
    wx.navigateTo({
      url: '/pages/ask/ask',
    })
  },
  //视频拍摄
  goVideoappointments(){
    wx.navigateTo({
      url: '/pages/Videoappointments/Videoappointments',
    })
  },
  //发布文章
  goarticle() {
    wx.navigateTo({
      url: '/pages/article/article',
    })
  },
  goCertification(){
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  goFlow: function(e) {
    var that = this;
    var ftype = e.currentTarget.dataset.type;
    var title = e.currentTarget.dataset.title;
    console.log(e);
    wx.navigateTo({
      url: '../flow/flow?ftype=' + ftype + '&title=' + title,
    })
  },

  gotodiseaseList: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../diseaseList/diseaseList?diseaseId=" + id + "&keywords=",
    });
    that.setData({
      diseaseId: id
    })
  },
  more: function() {
    wx.navigateTo({
      url: '../department/department',
    })
  },
  // 重新上传三证
  goUploadagain: function () {
    wx.navigateTo({
      url: '../Uploadagain/Uploadagain',
    })
  },
  gotoRecord: function(e) {
    var that = this;
    var question = e.currentTarget.dataset.questionid;
    var title = e.currentTarget.dataset.title;
    var age = e.currentTarget.dataset.age != undefined ? e.currentTarget.dataset.age : 0;
    console.log(age)
    console.log(e)
    wx.navigateTo({
      url: '../record/record?questionId=' + question + '&title=' + title + '&age=' + age,
    })
  },
  saveWords: function(e) {
    var that = this;
    that.setData({
      keyWords: e.detail.value
    })
  },
  goCenter() {
    wx.redirectTo({
      url: '/pages/center/center',
    })
  },
  goSearch: function() {
    var that = this;
    // console.log(that.data.keyWords);
    wx.navigateTo({
      url: '../diseaseList/diseaseList?keywords=' + that.data.keyWords,
      success: function() {
        that.setData({
          keyWords: '',
        })
      }
    });
  },
  go() {
    wx.navigateTo({
      url: '../doctorinformation/doctorinformation',
    })
  },
  Play() {
    var that = this
    bgMusic.play();
    that.setData({
      isOpen2: false
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "民福康医生-工作站",
      path: '/pages/index/index',
    }
  },
})