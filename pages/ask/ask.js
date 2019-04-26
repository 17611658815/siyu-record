// pages/ask/ask.js
var app = getApp();
Page({
  data: {
    oldName: '',
    askName: '',
    ishide: 'none', //支付成功页面显隐
    askId: '', //设置问题id
    askTitle: '', //设置问题标题
    userid: '',
    cooperation:'11',
    code: true,
    code2: true,
    err: '',
  },
  onLoad: function() {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    var phone = wx.getStorageSync('phone')
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
    console.log(userinfo);
   
    that.getDocterMsg(phone)
  },
  chooseSearchResultAction(e) {
    
    this.setData({
      oldName: e.currentTarget.dataset.val,
      askName: e.currentTarget.dataset.val
    })
  },
  //判断登录状态
  getCode(phone) {
    var that = this
    wx.request({
      // url: app.globalData.ip + '?type=user_check&phone=' + phone,
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
  // 重新上传三证
  goUploadagain: function () {
    wx.navigateTo({
      url: '../Uploadagain/Uploadagain',
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
  // 获取问题
  askName: function(e) {
    var that = this;
    var value = e.detail.value
    that.setData({
      oldName: e.detail.value
    })
    console.log(that.data.oldName)
    if (e.detail.value.length>0) {  
        wx.request({
          url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getLikeQuestion/',
          data:{
            appid:app.globalData.appid,
            keyword: e.detail.value
          },
          success: function(res) {
            console.log(res)
            let searchData = res.data.data.map(function(res) {
              return {
                key: value,
                name: res.title
              }
            })
            that.setData({
              searchData,
              searchResultDatas: res.data.data
            })
          },
          fail: function(res) {},
        })
    } else if (e.detail.value == 0){ //如果val为空 清空列表
      this.setData({
        searchResultDatas: []
      })
    }
  },
  // 提交问题
  saveName: function() {
    var that = this;
    console.log(that.data.oldName);
    var oldName = that.data.oldName;
    if(that.data.userid == ''){
      app.alert('您资质正在审核,暂无法提交问答')
      return
    }
    if (that.checkInput(oldName)) {
      wx.request({
        // url: app.globalData.ip + '?type=save_self_question&uid=' + that.data.userid + '&question=' + that.data.askName,
        url:"https://mfkapi.39yst.com/appInterface/kangaiduo/saveSelfQuestion/",
        data:{
          appid:app.globalData.appid,
          userid: that.data.userid,
          question: that.data.oldName
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res.data.questionid);
          if (res.data.code == 200) {
            that.setData({
              ishide: 'block',
              isclose: false,
              askId: res.data.questionid,
            })
          } else{
            that.alert(res.data.msg);
          }
        },
        fail: function(res) {
          console.log(res)
        },
      });
    }
  },
  //校验输入问题名称不为空
  checkInput: function (oldName) {
    var that = this;
    if (oldName.length == 0) {
      that.alert("您还没有填写常见问题哦~");
      return false;
    }
    return true;
  },
  close: function() {
    var that = this;
    that.setData({
      ishide: 'none',
      isclose: true,
    })
  },
  goCertification() {
    wx.navigateTo({
      url: '../certification/certification',
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
  gotoSetNew: function() {
    this.setData({
      searchResultDatas: [],
      oldName:'',
      ishide: 'none',
    })
  },
  gotoRecord: function() {
    var that = this;
    wx.redirectTo({
      url: '../record/record?questionId=' + that.data.askId + '&is_self=1',
    })
  },
  //分享页面 
  onShareAppMessage: function() {
    var that = this;
    return {
      title: "民福康医生-自问自答",
      path: '/pages/ask/ask',
    }
  },
})