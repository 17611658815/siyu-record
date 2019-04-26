
//index.js  
//获取应用实例  
var app = getApp()
Page({
  data: {
    is_pay: '',
    userid: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    durations: 500,
    illnessList: [], //常见疾病
    adeptList: [], //擅长
    commonIllnessList: [], //常见问题列表
    menuType: [],
    scrollNum: 0,
    scrollTop: 0,
    goodHeight: 88,
    firstFloor: [], //总列表
    firstIllness: [], //疾病列表
    diseaseId: 0,
    keyWords: '', //搜索关键词
    color: "none",
    page: 1,
    windowHeight: "",
    windowWidth: "",
    hasnext: true,
    loading: false,
    show: false,
    active: "",
    setting: {
      s: 0
    },
    arr: ['擅长问题', '全部问题'],
    switchTab: 0,
    isOpen2: false,
    isOpen: false, //播放开关
    starttime: '00:00', //正在播放时长
    duration: '06:41', //总时长
    code: true,
    code2: true,
    err: '',
    cooperation: '11'
  },
  //判断距顶部距离 悬浮搜索框
  onPageScroll: function (e) {
    // console.log(e.scrollTop);//{scrollTop:99}
    var that = this;
    if (e.scrollTop > 0) {
      that.setData({
        color: "#6EA8F7"
      });
    } else {
      that.setData({
        color: "none"
      });
    }
  },
  onShow() {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    var phone = wx.getStorageSync('phone')
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    that.getDocterMsg(phone)
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    })
    if (userinfo != null && userinfo.mfk_doctor_id != undefined) {
      that.adeptList();

      that.setData({
        userid: userid
      })
    }

  },
  //判断userId是否过期抓取信息
  onLoad: function () {
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
  // 获取医生信息
  getDocterMsg(phone) {
    var that = this
    wx.request({
      // url: app.globalData.ip + '?type=doctor_info&phone='+phone ,
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
          cooperation: res.data.msg.cooperation
        })
        console.log(that.data.cooperation)
      }
    })
  },

   // 擅长
  adeptList: function () {
    var that = this;
    var firstFloor = that.data.firstFloor;
    var menuTid = that.data.menuType;
    var page = that.data.page;
    var adeptList = page == 1 ? [] : that.data.adeptList;
    app.loading();
    wx.request({
      // url: app.globalData.ip + '?type=get_doctor_question&uid=' + that.data.userid + "&page=" + page,
      url:'https://mfkapi.39yst.com/appInterface/mfkdoctor/getIndexArticleList/',
      data:{
        appid:app.globalData.appid,
        userid:that.data.userid,
        page:page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        var list = res.data.data;
        if (list.length <= 0) {
          that.data.hasnext = false;
        } else {
          for (var i = 0; i < list.length; i++) {
            adeptList.push(list[i]);
          };
          that.setData({
            adeptList: adeptList,
          });
        }
        that.data.loading = false;
      },
      complete: () => { // complete
        wx.hideToast();
      }
    })
  },
  goCertification() {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  onReachBottom: function () {
    var that = this;
    that.data.loading = true;
    that.data.page++;
    that.adeptList();
  },
  //认领文章
  publisharticle(){
     wx.navigateTo({
       url: '/pages/publisharticle/publisharticle',
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
  goCertification() {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  goFlow: function (e) {
    var that = this;
    var ftype = e.currentTarget.dataset.type;
    var title = e.currentTarget.dataset.title;
    console.log(e);
    wx.navigateTo({
      url: '../flow/flow?ftype=' + ftype + '&title=' + title,
    })
  },

  // 重新上传三证
  goUploadagain: function () {
    wx.navigateTo({
      url: '../Uploadagain/Uploadagain',
    })
  },
  
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    var that = this;
    return {
      title: "民福康医生-文章发布",
      path: '/pages/article/article',
    }
  },
})