// pages/register/register.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 60,
    noSend: true,
    tapTime: '',
    docInfo: {
      userInfo: '', //姓名
      idcard: '', //身份证号
      hospitalInfo: '', //医院
      deskInfo: '', //科室
      titleInfo: '', //职称
      phoneInfo: '', //手机号
      codeInfo: '', //验证码
      adeptInfo: [], //擅长疾病
      // multiID: ['1', '19'],
    },
    array: ['主任'], //客服
    arrayName: [],
    index: 0,
    rankShow: true,
    title: '职称',
    zhicheng: true,
    inpval: '',
    windowHeight: "",
    windowWidth: "",
    checkCode: true,
    isshow: true,
    multiIndex: [],
    multiArray: [],
    objectMultiArray: [],
    province: [],
    hospitalList:[],
    searchResultDatas:[],
    agree: true, //用户协议
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
    that.getDocdepment() //选择科室 科室列表
  },
  // 获取科室信息
  getDocdepment() {
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getDoctorRank',
      method: 'POST',
      data: {
        appid: app.globalData.appid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        for (var i = 0; i < res.data.list.length; i++) {
          that.data.arrayName.push(res.data.list[i].name)
        }
        that.setData({
          array: res.data.list,
          arrayName: that.data.arrayName
        })
      }
    })
  },
  bindMultiPickerChange: function(e) {
    var that = this
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      isshow: false,
    })
    console.log(that.data.docInfo.multiID)
  },
  bindMultiPickerColumnChange: function(e) {
    var that = this;
    var first = that.data.multiIndex[0] == undefined ? 0 : that.data.multiIndex[0],
      second = that.data.multiIndex[1] == undefined ? 0 : that.data.multiIndex[1],
      multiArray = that.data.multiArray,
      go = that.data.docInfo.multiID[0] == 0 && that.data.docInfo.multiID[1] == 0;
    if (e.detail.column == 0 || go) {
      first = e.detail.value;
      var name = multiArray[0][first],
        list = [];
      for (var i = 0; i < that.data.objectMultiArray.length; i++) {
        if (that.data.objectMultiArray[i].parid == 0 && that.data.objectMultiArray[i].regname == name) {
          that.data.docInfo.multiID[0] = that.data.objectMultiArray[i].regid;
        }
      }
      if (that.data.docInfo.multiID[0] > 0) {
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.docInfo.multiID[0]) {
            list.push(that.data.objectMultiArray[i].regname);
          }
        }
      }
      multiArray[1] = list;
      go = true;
    }
    if (e.detail.column == 1 || go) {
      second = go ? 0 : e.detail.value;
      for (var i = 0; i < that.data.objectMultiArray.length; i++) {
        if (that.data.objectMultiArray[i].parid == that.data.docInfo.multiID[0] && that.data.objectMultiArray[i].regname == multiArray[1][second]) {
          that.data.docInfo.multiID[1] = that.data.objectMultiArray[i].regid;
          break;
        }
      }
    }
    console.log(that.data.docInfo)
    var multiIndex = [first, second];
    that.setData({
      multiArray: multiArray,
      multiIndex: multiIndex,
      isshow: false,
    })
  },
  // 选择医院
  chooseHospital(e){
    let that = this;
    let name = e.currentTarget.dataset.val;
    console.log(e)
    that.setData({
      'docInfo.hospitalInfo': name,
      searchResultDatas:[]
    })
    console.log(e)

  },
  //选择职称
  bindPickerChange: function(e) {
    var that = this
    that.setData({
      index: e.detail.value,
      rankShow: false,
      "docInfo.titleInfo": that.data.array[e.detail.value].id,
      title: that.data.arrayName[e.detail.value],
      zhicheng: false
    })
    console.log(that.data.docInfo, '职称')
  },
  // 添加擅长
  addadep(e) {
    var that = this
    that.setData({
      inpval: e.detail.value
    })
  },
  goAgreement: function() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },
  addPuhs() {
    var that = this
    if (that.data.inpval == '') {
      app.alert('内容不能为空！')
    } else {
      that.data.docInfo.adeptInfo.unshift(that.data.inpval)
      that.setData({
        docInfo: that.data.docInfo,
        inpval: ''
      })
    }
  },
  deladep(e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    var adep = that.data.docInfo
    adep.adeptInfo.splice(index, 1);
    that.setData({
      docInfo: adep
    })
  },
  // 姓名
  saveUser(e) {
    var that = this
    that.data.docInfo.userInfo = e.detail.value
    that.setData({
      docInfo: that.data.docInfo,
    })
    console.log(that.data.docInfo, '姓名')
  },
  // 身份证号
  saveidcard(e) {
    var that = this
    that.data.docInfo.idcard = e.detail.value
    that.setData({
      docInfo: that.data.docInfo,
    })
    console.log(that.data.docInfo)
  },
  // 出诊医院
  savehospital(e) {
    var that = this
    that.data.docInfo.hospitalInfo = e.detail.value
    if (e.detail.value.length > 0) {
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getLikeHospital',
        data: {
          appid: app.globalData.appid,
          hospital: e.detail.value
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data.list)
          let searchData = res.data.list.map(function (res) {
            console.log(res)
            return {
              key: e.detail.value,
              name: res.name,
              id: res.id
            }
          })
          that.setData({
            searchData,
            docInfo: that.data.docInfo,
            searchResultDatas: res.data.list
          })
          console.log(that.data.searchData)
        }
      })
    } else if (e.detail.value == 0) { //如果val为空 清空列表
      this.setData({
        searchResultDatas: []
      })
    }
   
    console.log(that.data.docInfo, '医院')
  },
  // 收起
  upList(){
    this.setData({
      searchResultDatas: []
    })
  },
  //出诊科室
  savedesk(e) {
    var that = this
    that.data.docInfo.deskInfo = e.detail.value
    that.setData({
      docInfo: that.data.docInfo,
    })
    console.log(that.data.docInfo, '科室')
  },
  // 职称
  saveTitle(e) {
    var that = this
    that.data.docInfo.titleInfo = e.detail.value
    that.setData({
      docInfo: that.data.docInfo,
    })
    console.log(that.data.docInfo, '职称')
  },
  // 手机号
  savePhone(e) {
    var that = this
    that.data.docInfo.phoneInfo = e.detail.value
    that.setData({
      docInfo: that.data.docInfo,
    })
    console.log(that.data.docInfo, '手机号')
  },
  // 验证码
  saveCode(e) {
    var that = this
    that.data.docInfo.codeInfo = e.detail.value
    that.setData({
      docInfo: that.data.docInfo,
    })
    console.log(that.data.docInfo)
  },
  // 擅长
  saveadept(e) {
    var that = this
    that.data.docInfo.adeptInfo = e.detail.value
    that.setData({
      docInfo: that.data.docInfo,
    })
    console.log(that.data.docInfo)
  },
  sendCode: function() {
    var that = this;
    var num = that.data.num;
    var phone = that.data.docInfo.phoneInfo;
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/common/checkExpertPhone/',
      data: {
        appid: app.globalData.appid,
        phone: phone
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '手机号已注册,请直接登录',
            confirmText: '立即登录',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/login/login',
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
  // 检测手机号码
  getCode: function() {
    var that = this;
    var num = that.data.num;
    var phone = that.data.docInfo.phoneInfo;
    var iphoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var nowTime = new Date();
    if (that.data.docInfo.userInfo == '') {
      app.alert("请输入姓名")

    } else if (that.data.docInfo.phoneInfo.length != 11 && !iphoneReg.test(that.data.docInfo.phoneInfo)) {
      app.alert("请输入您的手机号")
    } else {
      wx.request({
        url: "https://mfkapi.39yst.com/appInterface/user/sendSmsCode",
        data: {
          appid: app.globalData.appid,
          phone: that.data.docInfo.phoneInfo
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
          console.log(res.data);
          console.log('is failed');
          app.alert(res.data.msg);
        }
      })
    }
  },
  //校验验证码
  checkCode() {
    var that = this
    var IDcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var iphoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (that.data.docInfo.userInfo == '') {
      app.alert("请输入姓名")
    } else if (that.data.docInfo.phoneInfo.length != 11 && !iphoneReg.test(that.data.docInfo.phoneInfo)) {
      app.alert("请输入正确的手机号")
    } else if (that.data.docInfo.codeInfo == '') {
      app.alert("请输入验证码")
    } else if (that.data.docInfo.hospitalInfo == '') {
      app.alert("请输入所在医院")
    } else if (that.data.docInfo.deskInfo == '') {
      app.alert("请输入输入科室")
    } else if (that.data.docInfo.titleInfo == '') {
      app.alert("请输入职称")
    } else if (that.data.docInfo.adeptInfo.length == 0) {
      app.alert("请输入擅长疾病")
    } else if (that.data.agree == false) {
      app.alert("您还没同意用户协议哦")
    } else {
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/user/checkSmsCode',
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        data: {
          appid: app.globalData.appid,
          phone: that.data.docInfo.phoneInfo,
          code: that.data.docInfo.codeInfo
        },
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            that.nextStep()
          } else {
            app.alert(res.data.msg)
          }
        },
        fail: function(res) {
          console.log('is failed');
        }
      })
    }
  },
  //存储医生注册信息
  saveDoctorInfo() {
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveExpertInfo/',
      method: 'POST',
      data: {
        appid: app.globalData.appid,
        mobile: that.data.docInfo.phoneInfo, //手机号
        name: that.data.docInfo.userInfo, //姓名
        adept: that.data.docInfo.adeptInfo.join(','),//擅长疾病
        department: that.data.docInfo.deskInfo, //科室
        doctor_rank: that.data.docInfo.titleInfo, //职称
        hospital: that.data.docInfo.hospitalInfo,//医院
        is_reg: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data.code)
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/skip/skip',
          })
        }
      }
    })
  },
  nextStep() {
    var that = this
    app.docInfo = that.data.docInfo;
    console.log(that.data.docInfo)
    that.saveDoctorInfo()
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  goCertification() {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  //分享页面 
  onShareAppMessage: function() {
    var that = this;
    return {
      title: "民福康医生注册",
      path: '/pages/register/register',
    }
  },
})