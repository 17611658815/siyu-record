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
    cooperation: '11',
    illnesslengthNum:'1',
    adeplengthNum:'1',
    values:'',//搜索内容
    off:false
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
      that.loadList();
     
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
    console.log(that.data.adeptList)
    //   that.adeptList();
    //   that.loadList();
    if (userinfo == null) {
      wx.redirectTo({
        url: '../login/login',
      })
    } else if (userinfo != undefined && userinfo.mfk_doctor_id == undefined) { //信息审核中
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
  // 下拉刷新
  pullUpLoad: function () {
    var that = this;
    console.log()
    if (that.data.switchTab == 0) {
      that.data.loading = true;
      that.data.page++;
      that.adeptList();
      
    } else {
      that.data.loading = true;
      that.data.page++;
      that.loadList();
    }
  },

  // 全部问题
  loadList: function () {
    var that = this;
    var firstFloor = that.data.firstFloor;
    var menuTid = that.data.menuType;
    var page = that.data.page;
    var illnessList = page == 1 ? [] : that.data.illnessList;
    if (that.data.off) {
      return
    }
    app.loading();
    wx.request({
      url:"https://mfkapi.39yst.com/appInterface/mfkdoctor/getDoctorQuestionList/",
      data:{
        appid:app.globalData.appid,
        userid: that.data.userid,
        listtype:2,
        page:page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        app.globalData.setting = res.data.setting;
        var list = res.data.list;
        // var list = [];
        if (list.length <= 0) {
          that.data.hasnext = false;
          that.setData({
            off:true
          })
        } else {
          for (var i = 0; i < list.length; i++) {
            illnessList.push(list[i]);
          };
          that.setData({
            illnessList: illnessList,
            num: res.data.answer_num
          });
        }
        that.setData({
          illnesslengthNum: illnessList.length,
        })
        console.log(illnessList.length,that.data.illnesslengthNum)
        that.data.loading = false;
      },
      complete: () => { // complete
        wx.hideToast();
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
    if(that.data.off){
      return
    }
    app.loading();
    wx.request({
      url: "https://mfkapi.39yst.com/appInterface/mfkdoctor/getDoctorQuestionList/",
      data: {
        appid: app.globalData.appid,
        userid: that.data.userid,
        listtype: 1,
        page: page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        app.globalData.setting = res.data.setting;
        var list = res.data.list;
        // var list =[];
        if (list.length <= 0) {
          that.data.hasnext = false;
          that.setData({
            off: true
          })
        } else {
          for (var i = 0; i < list.length; i++) {
            adeptList.push(list[i]);
          };
          that.setData({
            adeptList: adeptList,
            num: res.data.answer_num
          });
        }
        that.setData({
          adeplengthNum: adeptList.length
        })
        if (list.length <= 0 && that.data.adeptList == 0){
            that.setData({ switchTab: 1 })
        }
        that.data.loading = false;
        console.log(adeptList.length, that.data.adeplengthNum)
      },
      complete: () => { // complete
        wx.hideToast();
      }
    })
  },
  searchinllness(e){
    var that = this
    console.log(e)
    that.setData({
      values: e.detail.value
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
  switchTab(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log(e)
    that.setData({
      switchTab: index,
      page: 1,
      off:false

    })

    if (that.data.switchTab == 0) {
      that.adeptList()
    } else {
      

      that.loadList()
    }
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

  gotodiseaseList: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../diseaseList/diseaseList?diseaseId=" + id + "&keywords=",
    });
    that.setData({
      diseaseId: id
    })
  },
  // more: function () {
  //   wx.navigateTo({
  //     url: '../department/department',
  //   })
  // },
  // 重新上传三证
  goUploadagain: function () {
    wx.navigateTo({
      url: '../Uploadagain/Uploadagain',
    })
  },
  gotoRecord: function (e) {
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
  goAsk: function () {
    wx.navigateTo({
      url: '../ask/ask',
    })
  },
  saveWords: function (e) {
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
  goSearch: function () {
    var that = this;
    wx.navigateTo({
      url: '../search/search',
      success: function () {
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
      title: "民福康医生-有声问答",
      path: '/pages/audioList/audioList',
    }
  },
})