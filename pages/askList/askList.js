
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
    id:'',
    play:false,
    off_on: false,//加载开关
  },
  onLoad: function (option) {
    var that = this;
    console.log(app)
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = userinfo.id != undefined ? userinfo.id : 0;
    console.log(userid)
    that.setData({
      is_pay: userinfo.is_pay
    })
    console.log(that.data.is_pay)
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    }else {
      var that = this;
      // var is_pay = that.data.is_pay
      // is_pay = userinfo.is_pay
      // if (is_pay == 0) {
      //   this.setData({
      //     show: true,
      //     active: "600rpx",
      //     userid: userid
      //   });
      // } else {
      this.setData({
        // show: false,
        // active: "425rpx",
        userid: userid
      });
      // }
    }

    var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?userid=' + that.data.userid + '&page=' + that.data.page+'&appid='+app.globalData.appid;
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
  pullUpLoad: function () {
    var that = this
    that.data.page++
    if (that.data.currentTab == 0){
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?userid=' + that.data.userid + '&page=' + that.data.page+'&appid='+app.globalData.appid;
      that.loadList(url);
    } else if (that.data.currentTab == 1){
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=0&userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;
      that.loadList(url);
    } else if (that.data.currentTab == 2){
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=0' + '&appid=' + app.globalData.appid;
      that.loadList(url);
    } else if (that.data.currentTab == 3){
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=2' + '&appid=' + app.globalData.appid;
      that.loadList(url);
    }else{
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=1' + '&appid=' + app.globalData.appid;
      that.loadList(url);
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    var id = that.data.id 
    if (that.data.play){
      that.gotoPause2()
    }
    console.log(e)
    that.setData({
      currentTab: e.detail.current,
      off_on: false,
      page: 1,
    });
    if (e.detail.current == 0) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;
      that.loadList(url);
    } else if (e.detail.current == 1) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=0&userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;
      that.loadList(url);
    } else if (e.detail.current == 2) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=0' + '&appid=' + app.globalData.appid;
      that.loadList(url);
    } else if (e.detail.current == 3) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=2' + '&appid=' + app.globalData.appid;
      that.loadList(url);
    }
    else if (e.detail.current == 4) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=1' + '&appid=' + app.globalData.appid;
      that.loadList(url);
    }
  },
  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    var id = that.data.id
    if (that.data.play) {
      that.gotoPause2()
    }
    console.log(e.target.dataset.current);
    if (this.data.currentTab === e.target.dataset.current) {
      console.log('22')
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        off_on: false,
        page: 1,
      });
      if (e.target.dataset.current == 0) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;
        that.loadList(url);
      } else if (e.target.dataset.current == 1) {
         console.log('待回答')
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=0&userid=' + that.data.userid + '&page=' + that.data.page + '&appid=' + app.globalData.appid;
        that.loadList(url);
      } else if (e.target.dataset.current == 2) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=0' + '&appid=' + app.globalData.appid;
        that.loadList(url);
      } else if (e.target.dataset.current == 3) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=2' + '&appid=' + app.globalData.appid;
        that.loadList(url);
      }
      else if (e.target.dataset.current == 4) {
        var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionList/?is_answer=1&userid=' + that.data.userid + '&page=' + that.data.page + '&status=1' + '&appid=' + app.globalData.appid;
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
        var audioList = res.data.date;
        for (var i = 0; i < audioList.length; i++) {
          audioList[i].isplay = false;
          audioList[i].playtime = false;
        };
        console.log(audioList);
        if (that.data.page == 1) {
          console.log(111111)
          that.setData({
            answerList: audioList,
            listNum: res.data.date.length,
          })
          console.log(that.data.listNum, that.data.answerList)
        } else {
          if (res.data.date.length!=0){
            for (var i = 0; i < res.data.date.length; i++) {
              that.data.answerList.push(res.data.date[i])
            }
            that.setData({
              answerList: that.data.answerList,
              listNum: res.data.date.length,
            });
          }else{
            that.setData({
              off_on: true,
            });
          }
        }
        console.log(that.data.answerList)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  gotoPause2: function () {
    var that = this;
    console.log(that.data.answerList)
    var AudioList = that.data.answerList;
    console.log(AudioList[that.data.id])
    AudioList[that.data.id].isplay = false;
    clearInterval(that.data.playtimer);
    that.setData({
      playTime: 0,
      answerList: AudioList,
      play: false
    });
    innerAudioContext.stop();
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

    clearInterval(that.data.playtimer);
    var id = e.target.dataset.id;
    that.setData({ id: id })
    console.log(that.data.id)
    innerAudioContext.title = e.target.dataset.title;
    var AudioList = that.data.answerList;
    console.log(AudioList[id])
    var max = AudioList[id].duration
    console.log(max)
    var playTime = 0;
    for (var i in AudioList) {
      console.log(i)
      if (i == id) {
        AudioList[i].isplay = true;
        innerAudioContext.src = AudioList[id].record; // 设置了 src 之后会自动播放
        innerAudioContext.play();
      } else {
        AudioList[i].isplay = false;
        innerAudioContext.src = AudioList[id].record; // 设置了 src 之后会自动播放
      }
      AudioList[i].playtime = playTime;
    }
    console.log(AudioList);
    console.log(AudioList[id].playtime)
    var playS = AudioList[id].playtime % 60;
    var playM = "0" + parseInt(AudioList[id].playtime / 60);
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
      console.log(playTime, AudioList[id].duration)
      playS = playTime % 60;
      playM = "0" + parseInt(playTime / 60);
      if (playS < 10) {
        playS = "0" + playS;
      };
      if (playTime >= AudioList[id].duration) {
        console.log('自然结束播放')
        AudioList[id].playtime = 0;
        clearInterval(that.data.playtimer);
        innerAudioContext.stop();
        AudioList[id].isplay = false;
        that.setData({
          playTime: 0,
          offset: 0,
          answerList: AudioList,
          play:false
        });
      } else {
        AudioList[id].playtime = playTime;
        that.setData({
          playTime: playTime,
          answerList: AudioList,
          playM: playM,
          playS: playS,
          offset: playTime,
          max: max,
          path: AudioList[id].record,
          id:id,
          play:true
        });
        // console.log(that.data.id)
      }
    }, 1000);
    innerAudioContext.onEnded(function () {
      AudioList[id].isplay = false;
      that.setData({
        answerList: AudioList
      });
    });
  },
  gotoPause: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var AudioList = that.data.answerList;
    console.log(e)
    AudioList[id].isplay = false;
    clearInterval(that.data.playtimer);
    that.setData({
      playTime: 0,
      answerList: AudioList,
      play: false
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
    var question = e.currentTarget.dataset.question;
    var id = e.currentTarget.dataset.id;
    var questionid = e.currentTarget.dataset.questionid
    var title = e.currentTarget.dataset.title;
    var created = e.currentTarget.dataset.created;
    if (question!=0){
      var id = that.data.id || ''
        that.gotoPause2(id)
        wx.navigateTo({
          url: '/pages/audioMsg/audioMsg?question=' + question +'&is_self=1',
        })
    }else{
      console.log(questionid)
      wx.navigateTo({
        url: '/pages/Toanswer/Toanswer?id=' + questionid + '&title=' + title + '&created=' + created +'&is_self=1',
      })
    }
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
  //前往回答问题
  gotoRecord: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var is_self = e.currentTarget.dataset.is_self;
    wx.redirectTo({
      url: '../record/record?questionId=' + id + '&is_self=' + is_self,
    });
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
      title: "民福康医生-我的自问自答",
      path: '/pages/askList/askList',
    }
  },
})

