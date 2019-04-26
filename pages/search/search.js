// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageChange: true,
    searchMsg:'',
    oldName:'',
    speciality:'',//擅长疾病
    userid:'',
    illnessArray:''
  },
  // 获取问题
  searchMsgs: function (e) {
    var that = this;
    var value = e.detail.value
    that.setData({
      searchMsg: e.detail.value
    })
    console.log(that.data.oldName)
    if (e.detail.value.length > 0) {
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getLikeQuestion/',
        data: {
          appid: app.globalData.appid,
          keyword: e.detail.value
        },
        success: function (res) {
          console.log(res)
          let searchData = res.data.data.map(function (res) {
            return {
              key: value,
              name: res.title,
              id:res.id
            }
          })
          that.setData({
            searchData,
            searchResultDatas: res.data.data
          })
        },
        fail: function (res) { },
      })
    } else if (e.detail.value == 0) { //如果val为空 清空列表
      this.setData({
        searchResultDatas: []
      })
    }
  },
  chooseSearchResultAction(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      searchMsg: e.currentTarget.dataset.val,
    })
    wx.navigateTo({
      url: '/pages/record/record?questionId='+id,
    })
  },
  
  // 擅长疾病
  specialityIllness() {
    let that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertIllness/',
      data:{
        appid:app.globalData.appid,
        userid:that.data.userid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POSt',
      success: function (res) {
        that.setData({
          speciality:res.data.data
        })
      }
    })
  },
  // 点击搜索
  searchIllness(){
    let that = this
    if (that.data.searchMsg!=''){
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getIllnessQuestionList/',
        data: {
          appid: app.globalData.appid,
          userid: that.data.userid,
          keyword: that.data.searchMsg

        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POSt',
        success: function (res) {
          console.log(res.data.list)
          that.setData({
            illnessArray: res.data.list,
            pageChange: false
          })
        }
      })
    }else{
      app.alert('搜索内容不能为空！')
    }
    
  },
  // 去录音
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
  // 
  searchSpeciality(e){
    console.log(e)
    let that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getIllnessQuestionList/',
      data: {
        appid: app.globalData.appid,
        userid: that.data.userid,
        illness_id: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POSt',
      success: function (res) {
        console.log(res.data.list)
        that.setData({
          illnessArray:res.data.list,
          pageChange: false
        })
      }
    })
  },
  goask(){
    wx.navigateTo({
      url: '/pages/ask/ask',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || null;
    var phone = wx.getStorageSync('phone')
    var userid = userinfo != undefined ? userinfo.id : 0;
    that.setData({
      userid: userid
    })
    this.specialityIllness()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     this.setData({
       searchMsg:'',
       searchResultDatas: []
     })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})