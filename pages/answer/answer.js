// pages/answer/answer.js
//背景音乐播放
// const backgroundAudioManager = wx.getBackgroundAudioManager();
var innerAudioContext = wx.getBackgroundAudioManager();
var app = getApp();
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    rules: [],
    answerList: [],
    // allAnswer: [],
    // inreviewAnswer: [],
    // noThroughAnswer: [],
    // passedAnswer: [],
    loading: false,
    listNum: 0,
    page: 1, //当前页
    hasnext: 1,
    persent: 0,
    isplay: false,
    playM: '00',
    playS: '00',
    playTime: 0, //播放时长
    errmsg: "",
    show: false,
    is_pay: '',
    userid: '',
    active: "",
    offset: 0,
    max: 0,
    path: '',
    play:false,
    off_on: false,//加载开关
  },
  onLoad: function (option) {
    var that = this;
    console.log(app)
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = userinfo.id != undefined ? userinfo.id : 0;
    that.setData({
      is_pay: userinfo.is_pay
    })
    console.log(that.data.is_pay)
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    }
   else {
      var that = this;
      this.setData({
        userid: userid
      });
    }

    var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page+'&appid='+app.globalData.appid;
    that.loadList(url);
    // 获取硬件信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  // 上拉加载
  pullUpLoad(){
    var that = this;
    that.data.page++
    console.log(that.data.page)
    if (that.data.currentTab == 0){
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    } else if (that.data.currentTab == 1){
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=0' + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    } else if (that.data.currentTab == 2){
      console.log('未通过')
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=2' + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    }else{
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=1' + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    console.log(that.data.page)
    if (that.data.play) {
      that.gotoPause2(that.data.path)
    }
    that.setData({
      currentTab: e.detail.current,
      off_on: false,
      page: 1,
    });
    if (e.detail.current == 0) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    } else if (e.detail.current == 1) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=0' + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    } else if (e.detail.current == 2) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=2' + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    } else if (e.detail.current == 3) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=1' + '&appid=' + app.globalData.appid;;
      that.loadList(url);
    }
  },
  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    var path = that.data.path || ''
    if (that.data.play) {
      that.gotoPause2(that.data.path)
    }
  
    console.log(e.target.dataset.current);
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        off_on: false,
        page: 1,
      });
      if (e.target.dataset.current == 0) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;;
        that.loadList(url);
      } else if (e.target.dataset.current == 1) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=0' + '&appid=' + app.globalData.appid;;
        that.loadList(url);
      } else if (e.target.dataset.current == 2) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=2' + '&appid=' + app.globalData.appid;;
        that.loadList(url);
      } else if (e.target.dataset.current == 3) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getExpertRecordList/?userid=' + that.data.userid + '&page=' + that.data.page + '&status=1' + '&appid=' + app.globalData.appid;;
        that.loadList(url);
      }
    }
  },

  loadList: function (url) {
    var that = this;
    var answerList = that.data.answerList;
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        var audioList = {};
        console.log(res.data.data);
        for (var i = 0; i < res.data.data.length; i++) {
          audioList[res.data.data[i].record] = res.data.data[i];
          audioList[res.data.data[i].record].isplay = false;
          audioList[res.data.data[i].record].playtime = 0;
          console.log(audioList[res.data.data[i].record])
        };
        if (that.data.page == 1) {
          console.log('page=1')
          that.setData({
            answerList: audioList,
            listNum: res.data.data.length == undefined ? 0 : res.data.data.length,
          })
        } else {
          if (res.data.data.length!=0){
            for (var i = 0; i < res.data.data.length; i++) {
              that.data.answerList[res.data.data[i].record] = res.data.data[i];
            }
            that.setData({
              answerList: that.data.answerList,
            })
          }else{
            that.setData({
              off_on: true,
            })
            console.log('没数据了。。')
          }         
          
        }
        console.log(that.data.answerList)
      },
      fail: function (res) {
        console.log(res)
      }
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
  //点击播放录音 
  gotoPlay: function (e) {
    var that = this;
    console.log(e)
    clearInterval(that.data.playtimer);
    var path = e.target.dataset.path;
    innerAudioContext.title = e.target.dataset.title;
    var AudioList = that.data.answerList;
    var max = AudioList[path].duration
    console.log(path)
    var playTime = 0;
    for (var i in AudioList) {
      console.log(i)
      if (i == path) {
        AudioList[i].isplay = true;
        innerAudioContext.src = path; // 设置了 src 之后会自动播放
        innerAudioContext.play();
      } else {
        AudioList[i].isplay = false;
        innerAudioContext.src = path; // 设置了 src 之后会自动播放
      }
      AudioList[i].playtime = playTime;
    }
    console.log(AudioList);
    console.log(AudioList[path].playtime)
    var playS = AudioList[path].playtime % 60;
    var playM = "0" + parseInt(AudioList[path].playtime / 60);
    if (playS < 10) {
      playS = "0" + playS;
    };
    that.setData({
      playM: playM,
      playS: playS
    });
    console.log('开始')
    that.data.playtimer = setInterval(function () {
      playTime++;
      console.log(playTime, AudioList[path].duration)
      console.log(that.data.offset)
      playS = playTime % 60;
      playM = "0" + parseInt(playTime / 60);
      if (playS < 10) {
        playS = "0" + playS;
      };
      if (playTime >= AudioList[path].duration) {
        console.log('自然结束播放')
        AudioList[path].playtime = 0;
        clearInterval(that.data.playtimer);
        innerAudioContext.stop();
        AudioList[path].isplay = false;
        that.setData({
          playTime: 0,
          offset: 0,
          answerList: AudioList,
          play:false
        });
      } else {
        console.log('播放中')
        AudioList[path].playtime = playTime;
        that.setData({
          playTime: playTime,
          answerList: AudioList,
          playM: playM,
          playS: playS,
          offset: playTime,
          max: max,
          path: path,
          play:true
        });
        console.log(that.data.path)
      }
    }, 1000);
    innerAudioContext.onEnded(function () {
      AudioList[path].isplay = false;
      that.setData({
        answerList: AudioList
      });
    });
  },
  gotoPause: function (e) {
    var that = this;
    var path = e.target.dataset.path;
    var AudioList = that.data.answerList;
    console.log(e.target.dataset.path)
    console.log(AudioList[path])
    AudioList[path].isplay = false;
    clearInterval(that.data.playtimer);
    that.setData({
      playTime: 0,
      answerList: AudioList,
      play: false
    });
    innerAudioContext.stop();
  },
  gotoPause2: function (path) {
    var that = this;
    var path = path;
    console.log(path)
    console.log(that.data.answerList)
    var AudioList = that.data.answerList;
    console.log(AudioList[path])
    AudioList[path].isplay = false;
    clearInterval(that.data.playtimer);
    that.setData({
      playTime: 0,
      answerList: AudioList,
      play:false
    });
    innerAudioContext.stop();
  },
  goindex: function () {
    wx.navigateTo({
      url: '../audioList/audioList',
    })
  },
  delAudio() {
    console.log('')
    var that = this;
    var path = that.data.path;
    var AudioList = that.data.answerList;
    for (var i in AudioList) {
      AudioList[path].isplay = false;
      clearInterval(that.data.playtimer);
      that.setData({
        playTime: 0,
        answerList: AudioList,
      });
    }
    innerAudioContext.stop();
  },
  goDetails: function (e) {
    var that = this;
    console.log(e)
    var AudioList = that.data.answerList;
    var path = e.currentTarget.dataset.path;
    app.globalData.errmsg = e.currentTarget.dataset.errmsg;
    for (var i in AudioList) {
      console.log(i)
      if (i == path) {
        AudioList[path].playtime = 0;
        clearInterval(that.data.playtimer);
        innerAudioContext.stop();
        AudioList[path].isplay = false;
        that.setData({
          playTime: 0,
          answerList: AudioList
        });
      }
    }
    var question = e.currentTarget.dataset.question;
    wx.navigateTo({
      url: '/pages/audioMsg/audioMsg?question=' + question,
    })
  },
  onHide() {
    var that = this
    console.log('离开')
    innerAudioContext.stop();
    clearInterval(that.data.playtimer)
  },
  onUnload() {
    var that = this
    console.log('离开')
    innerAudioContext.stop();
  },
  //前往设置新问题
  gotoAsk: function () {
    wx.redirectTo({
      url: '../ask/ask',
    });
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "民福康医生-我的有声问答",
      path: '/pages/answer/answer',
    }
  },
})