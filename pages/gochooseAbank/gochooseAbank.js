var app = getApp();
// pages/myBank/myBank.js
Page({

  data: {
    userid:'',
     bank:'',
     bankShow:true,
     userName:'',
     toView: 'eeede',
     bankId:'',
     list: [],
     keys:{}
  },

  onLoad: function (options) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    console.log(app.globalData.userName)
    that.getBankList()
  },
  getBankList(){
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    var userName = wx.getStorageSync('userName')
    var bankNum = wx.getStorageSync('bankNum')
    // var bank = app.globalData.bank;
    // var bankId = app.app.globalData.id;
    var bankShow = app.globalData.bankShow;
    if (userid == 0) {
      app.getUserInfo(that.onLoad);
      return
    }
    that.setData({
      userid: userid,
    })
    // 获取银行信息列表
    wx.request({
      url: app.globalData.ip +'?type=get_banklist&uid=' + that.data.userid,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        var list = res.data,
          keys = {hot:{v:'热'}},
        hot=[];
        for (var i = 0; i < list.length;i++){
          if (keys[list[i].key]==undefined){
            keys[list[i].key] = { v: list[i].key}
            list[i].idkey = list[i].key;
          }else{
            list[i].idkey = '';
          }
          if (list[i].hot==1){
            var item = {};
            item.id = list[i].id;
            item.name = list[i].name;
            item.key = list[i].key;
            item.idkey = '';
            if (hot.length==0){
              item.idkey ='hot';
            }
            hot.push(item);
          }
        }
        list = hot.concat(list);
        that.setData({
          list: list,
          keys: keys
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  // 选取银行卡路由
  gomyBank: function (e) {
    console.log(e)
    var that = this
    // var banks = e.target.dataset.bank
    var bankShow = that.data.bankShow
    var bankinfo = wx.getStorageSync('bankinfo');
    bankinfo.bank = e.target.dataset.bank;
    bankinfo.bank_id = e.target.dataset.id
    bankinfo.banShow = false
    wx.setStorageSync('bankinfo', bankinfo);
    that.go()
  },
  go:function(){
    var that = this;
    wx.setStorageSync('reload', true);
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '../myBank/myBank?bank=' + that.data.bank + '&bankShow=' + that.data.bankShow,
    // }); 
  },
  jumpTo: function (e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  }  
})

