// pages/video/video.js
const app = getApp()
Page({
  data: {
      videoId:"",//视频id
      videoMsg:{},//视频信息
      page: 1,
      url: '',
      TostShow: false,
      isHide: 'none',
      off_on: false,
      autoHeight:'',
      posterShow:false,
      boXShow:true,
      isplay:false,
      goIndex:false,
      title:'',
      doctorid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      videoId: options.videoId,
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          autoHeight: ((res.windowWidth) / 16) * 9
        });
      }
    });
    //直接调用
    that.getVideo()
  },
  gomfk(e) {
    var doctorid = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateToMiniProgram({
      appId: 'wxd8fd4122d8ed38e9',
      // path: 'pages/videohome/videohome',
      path: 'pages/doctorHomePage/doctorHomePage?doctorId=' + doctorid,
      extraData: {},
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log('打开了')
      }
    })
  },
  bindplay(){
    var taht = this
    this.setData({
      boXShow:false
    })
  },
  bindended(){
   var taht = this
    this.setData({
      boXShow:true,
      goIndex: true
    })
  },
  
  //获取视频信息
  getVideo(){
    var that = this;
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url:"https://mfkapi.39yst.com/appInterface/mfkdoctor/getVideoInfo/",
      data: {
        videoid: that.data.videoId,
        appid: app.globalData.appid,
      },
      method:'POST',
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          videoMsg:res.data.data,
          doctorid: res.data.data.doctor.id
        });
      }
    })
  },
  // onReachBottom: function () {
  //   var that = this
  //   var off_on = that.data.off_on
  //   if (off_on == true) {
  //     return
  //   }
  //   off_on = true
  //   that.data.page++
  //   that.loadingShow()
  //   wx.request({
  //     url: app.globalData.ip +'?type=details_shipin',
  //     data: {
  //       id: that.data.videoId,
  //       page: that.data.page
  //     },
  //     header: {
  //       'content-type': 'application/json' 
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       if (res.data.relevant.length>0){
  //         var videoLis = that.data.videoMsg;
  //         for (var i = 0; i < res.data.relevant.length; i++) {
  //           videoLis.relevant.push(res.data.relevant[i])
  //         }
  //         that.setData({
  //           videoMsg: videoLis,
  //           off_on: false
  //         });
  //       }else{
  //         that.setData({
  //           isHide: 'none',
  //           TostShow: true,
  //           off_on: true
  //         });
  //       }
       
  //     }
  //   })
  // },
  // //播放推荐视频
  // goVideo(e) {
  //   let that = this;
  //   let videoId = e.currentTarget.dataset.id;
  //   wx.redirectTo({
  //     url: 'video?videoId=' + videoId,
  //   })
  // },
  // godoctorHomeanswer(e) {
  //   var doctorId = e.currentTarget.dataset.id
  //   console.log(e)
  //   wx.navigateTo({
  //     url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId,
  //   })
  // },
  //loadingShow
  loadingShow() {
    var that = this
    that.setData({
      hidenLoad: true,
      isHide: 'block',
    })
  },
  loadingHide() {
    var that = this
    that.setData({
      hidenLoad: true,
      isHide: 'none',
    })
  },
  //返回首页
  goidnex(){
    var that = this
    wx.switchTab({
      url: '../index/index',
      // success: function (e) {
      //   var page = getCurrentPages().pop();
      //   if (page == undefined || page == null) return;
      //   page.onLoad();
      // }
    }) 
   
  },
  //点击再次播放
  repPlay(){
    var that = this
    var prevV = wx.createVideoContext('video');
    prevV.play()
    that.setData({
      boXShow: false,
      isplay: true
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return{
      title: that.data.title,
      path: '/pages/video/video?videoId=' + that.data.videoId + '&share_query=video',
    }
  },

})