//record.js  
//获取应用实例  
var app = getApp();
var util = require('../../utils/util.js');
var recorderManager = wx.getRecorderManager(); //录音管理
var innerAudioContext = wx.createInnerAudioContext(); //音频播放

var options = {
  duration: 300000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 48000,
  format: 'mp3',
  frameSize: 50,
};
//音乐播放
Page({
  data: {
    userid: '',
    isSpeaking: true, //是否正在说话
    actionSheetHidden: true, //抽屉菜单隐藏
    optionePath: '', //菜单操作地址
    num: 0, //录音时长
    audioName: {}, //音频数组
    winHeight: '', //屏幕宽
    isPause: true, //控制暂停继续
    minute: "00", //分
    second: "00", //秒
    title: '', //问题名称
    recoding: false, //是否重录
    audioMsg: {},
    progress: 0, //进度状态
    isPucse: true,
    isPlay: false,
    durations: "00:00", //默认播放音频时长
    src: '', //试听路径
    isOpen2: false,
    isOpen: false, //播放开关
    shade: false,
    isShow: true, //录音时长提示
    recording: false, //是否在录音
    text: '开始',
    shade: false, //录音播放器遮罩
    textShow: true,
    offset: 0, //进度条
    isHiden: true,
    colors: "#c1c1c1",
    audioId: "", //上传后的音频id
    record_txt: "", //音频校验文字
    shadeHiden: false, //大遮罩
    timeOrder: 30, //倒计时
    flage: true,
    tooltip: false, //首次点击播放文字提示
    is_self: 0,
    question:''
  },
  onLoad: function(option) {
    var that = this;
    console.log(option)
    var question = option.questionId;
    var is_self = option.is_self;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = userinfo != undefined ? userinfo.id : 0;
    //保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    };
    that.setData({
      userid: userid,
      question: question,
      is_self: is_self
    });
    console.log(that.data.question)
    //录音管理，new 出 第二阶段的实例
    recorderManager.onStop((res) => {
      console.log(res);
      const { tempFilePath } = res;
      var createDate = that.data.createDate;
      if (that.data.recoding) {
        clearInterval(that.data.timer);
        // that.startRecording(); // 唤起重新录音
        return false;
      }
      var stopTime = new Date().getTime();
      var length = that.data.recordLength;
      var audioArray = that.data.audioArray;
      console.log(res.tempFilePath)
    
      console.log(res)
      var savedFilePath = res.tempFilePath;
      console.log(savedFilePath);
      var audio = {
        filePath: savedFilePath,
        createDate: createDate,
        length: length,
        title: that.data.title.title,
        // isplay: false,
        questionid: that.data.question,
        playtime: 0,
        createTime: that.data.createTime,
        isupLoad: 0,
        appid: app.globalData.appid,
        userid: that.data.userid
      };
      console.log(that.data.question)
      that.setData({
        audioMsg: audio,
        src: res.tempFilePath
      })
      that.upLoad()
    });
    //录音管理，new 出 第二阶段的实例
    if (is_self!=1) {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getQuestionInfo/'
      that.getQuestion(question, url)
    } else {
      var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getSelfQuestionInfo/'
      that.getQuestion(question, url)
    }
    that.checkauth();
  },
  onShow: function(e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          winHeight: res.windowHeight,
          winHeight: res.windowWidth
        });
      }
    });
  },
  getQuestion(id, url) {
    var that = this
    wx.request({
      url: url,
      data: {
        appid: app.globalData.appid,
        questionid: id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        console.log(res.data)
        that.setData({
          title: res.data.data,
        })
      }
    })
  },
  //检查授权
  checkauth: function() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.showModal({
            title: '提示',
            content: '录音功能需要您的授权',
            success: function(res) {
              if (res.confirm) {
                wx.authorize({
                  scope: "scope.record",
                  success: function(res) {
                    that.data.hasauth = true;
                    console.log('chenggong')
                    console.log(res)
                  },
                  fail: function(res) {
                    that.data.hasauth = false;
                    if (res.errMsg == 'authorize:fail auth deny') { //用户拒绝授权，需删除小程序重新进入授权
                      app.alert('您已拒绝授权录音功能，重新授权需删除小程序重新打开授权');
                    }
                  },
                  complete: function(res) {
                    console.log('complete')
                  },
                });
              } else if (res.cancel) { //拒绝授权退回列表
                console.log('back')
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          that.data.hasauth = true;
        }
      }
    })
  },
  //开始录音
  startRecording() {
    var that = this
    if (app.globalData.firstGlance == 0) {
      app.globalData.firstGlance = 1
      that.setData({
        tooltip: true
      })
    } else {
      //录音开始
      that.listenerButtonStop()
      recorderManager.start(options)
      var num = that.data.num;
      var timeOrder = that.data.timeOrder
      var createTime = new Date().getTime();
      var createDate = util.formatTime(new Date);
      that.setData({
        recording: true, //录音中
        createDate: createDate,
        createTime: createTime,
        isSpeaking: false,
        minute: "00", //分
        second: "00", //秒
        offset: 0,
        starttime: "00:00",
        timeOrder: 30,
        isOpen2: false,
        isOpen: false, //播放开关
        isShow: false,
        shade: true,
        src: ''
      });
      // 记录录音时长
      that.data.timer = setInterval(function() {
        num++;
        timeOrder--;
        if (num > 29) {
          that.setData({
            num: num,
            timeOrder: timeOrder,
            colors: '#E21918'
          });
        } else {
          that.setData({
            num: num,
            timeOrder: timeOrder,
            colors: '#c1c1c1'
          });
        }
        var time = num;
        var second = time % 60;
        console.log(num, that.data.timer)
        var minute = "0" + parseInt(time / 60);
        if (second < 10) {
          second = "0" + second;
        }
        that.setData({
          second: second,
          minute: minute,
        })
        console.log(num, time)
        if (time >= 180) {
          console.log('三分钟')
          that.stopRecording();
          clearInterval(that.data.timer)
        }
      }, 1000);
    }

    console.log(that.data.timer)
  },
  //完成
  stopRecording() {
    console.log("停止录音...");
    var that = this;
    clearInterval(that.data.timer)
    that.data.recordLength = that.data.num;
    console.log(that.data.recordLength);
    console.log(arguments[0])
    if (arguments[0] != undefined && typeof(arguments[0]) == 'boolean') {
      that.data.recoding = arguments[0];
    } else {
      that.data.recoding = false;
    }
    that.setData({
      isSpeaking: true,
      num: 0,
      isrecording: false,
      durations: that.data.minute + ":" + that.data.second,
      progress: 0,
      recording: false,
      text: "重录",
      shade: false,
      textShow: false,
      isPlay: false,
      isPucse: true,
      timeOrder: 30,
      colors: "#c1c1c1",
      isShow: true

    });
    var stopTime = new Date().getTime();
    if (!that.data.recoding && that.data.recordLength < 29) {
      wx.showModal({
        title: '提示',
        content: '录音不足30秒哦！',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#6ea8f7',
        success: function(res) {
          if (res.confirm) {
            console.log('刷新本地列表');
          }
        }
      })
    };
    recorderManager.stop();
  },
  //重录
  remake() {
    var that = this
    that.setData({
      isSpeaking: true,
      src: '',
      text: '开始',
      textShow: true,
      progress: 0,
      record_txt: '',
      flage: true,
    })
  },
  //暂停录音
  pauseRecording() {
    console.log('暂停录音')
    var that = this
    that.setData({
      isPlay: true, //暂停
      isPucse: false, //暂停开关
    })
    recorderManager.pause();
    clearInterval(that.data.timer);
    console.log(that.data.timer)
  },
  //继续录音
  resumeRecording() {
    console.log("继续录音", 1);
    var that = this;
    var num = that.data.num;
    var timeOrder = that.data.timeOrder
    that.setData({
      isPucse: true, //暂停开关
      isPlay: false, //播放开关
    });
    recorderManager.resume();
    // 记录录音时长
    that.data.timer = setInterval(function() {
      num++;
      timeOrder--;
      if (num > 29) {
        that.setData({
          num: num,
          colors: '#E21918',
          timeOrder: timeOrder
        });
      } else {
        that.setData({
          num: num,
          colors: '#c1c1c1',
          timeOrder: timeOrder
        });
      }
      console.log(num, that.data.timer)
      var time = num;
      var second = time % 60;
      var minute = "0" + parseInt(time / 60);
      if (second < 10) {
        second = "0" + second;
      }
      that.setData({
        second: second,
        minute: minute,
      })
      console.log(num, time)
      if (time >= 180) {
        that.stopRecording();
        clearInterval(that.data.timer)
      }
    }, 1000);
  },
  // 重录
  reRecording() {
    var that = this
    console.log("重新录音...");
    that.setData({
      flage: false
    })
    that.stopRecording(true);
  },
  // 播放
  listenerButtonPlay: function() {
    var that = this
    innerAudioContext.src = that.data.src; // 设置了 src 之后会自动播放
    innerAudioContext.onPlay(() => {
      innerAudioContext.onTimeUpdate(() => {
        console.log(innerAudioContext.duration)
        var duration = innerAudioContext.duration;
        var offset = innerAudioContext.currentTime;
        var currentTime = parseInt(innerAudioContext.currentTime);
        var min = "0" + parseInt(currentTime / 60);
        var max = parseInt(innerAudioContext.duration);
        var sec = currentTime % 60;
        if (sec < 10) {
          sec = "0" + sec;
        };
        var starttime = min + ':' + sec; /*  00:00  */
        that.setData({
          offset: currentTime,
          starttime: starttime,
          max: max,
          changePlay: true,
          playing: false,
          progress: 1
        })
      })
    })
    // //播放结束
    innerAudioContext.onError(() => {
        app.alert('可能网络不太好，文字内容未翻译成功。建议您重录语音。')
      }),
      innerAudioContext.onEnded(() => {
        that.setData({
          starttime: '00:00',
          isOpen: false,
          offset: 0
        })
        console.log("音乐播放结束");
      })
    that.setData({
      isOpen: true,
    })
    innerAudioContext.play()
  },
  //暂停播放
  listenerButtonPause() {
    var that = this
    innerAudioContext.pause()
    that.setData({
      isOpen2: true
    })
  },
  //停止播放
  listenerButtonStop() {
    var that = this
    innerAudioContext.stop()
  },
  //进度条拖拽
  sliderChange(e) {
    var that = this
    var offset = parseInt(e.detail.value);
    innerAudioContext.play();
    innerAudioContext.seek(offset);
    that.setData({
      isOpen2: false,
    })
  },
  Play() {
    var that = this
    innerAudioContext.play();
    that.setData({
      isOpen2: false
    })
  },
  //跳过此题
  nextMsg() {
    var that = this
    that.listenerButtonStop()
    if (that.data.recording) {
      that.alert('录音中...')
    } else {
      wx.request({
        // url: app.globalData.ip + '?type=next_question&id=' + that.data.question + '&uid=' + that.data.userid,
        url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getNextQuestion/',
        data: {
          appid: app.globalData.appid,
          userid: that.data.userid,
          questionid: that.data.question
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: (res) => {
          if(res.data.code == 500){
            app.alert(res.data['0'])
          }else{
            that.setData({
              title: res.data.data,
              question: res.data.data.id,
              isSpeaking: true,
              src: '',
              text: '开始',
              textShow: true,
              progress: 0,
              record_txt: '',
              flage: true,
            })
          }
         
        }
      })
    }
  },
  getarertext(e) {
    var that = this
    that.setData({
      record_txt: e.detail.value
    })
    console.log(e)
  },
  alert(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  loading: function() {
    wx.showLoading({
      title: '加载中',
    })
  },
  recordingHint() {
    wx.navigateTo({
      url: '/pages/recordingHint/recordingHint?type=1',
    })
  },
  //页面卸载时停止播放
  onUnload() {
    var that = this
    that.listenerButtonStop() //停止播放
    recorderManager.stop();
    clearInterval(that.data.timer)
    clearTimeout(that.data.timOut)
    wx.hideLoading()
    console.log("离开")
  },
  //删除录音
  delaudio() {
    var that = this
    that.listenerButtonStop() //停止播放
    that.setData({
      src: '',
      text: '开始',
      isShow: true,
      textShow: true,
      progress: 0,
      flage: true,
    })
  },
  //上传音频
  upLoad: function() {
    // if (that.data.is_self) {
    //   var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveRecordAnswer/'
    // } else {
    //   var url = 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveSelfRecordAnswer/'
    // }
    
    var that = this;
    console.log(that.data.is_self)   
    var url = that.data.is_self != undefined ? 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveSelfRecordAnswer/' : 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveRecordAnswer/'
    wx.showLoading({
      title: '上传中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

    that.setData({
      isOpen2: false,
      isOpen: false, //播放开关
      offset: 0,
      starttime: "00:00",
      shadeHiden: true
    })
    // that.listenerButtonStop()
    var tempFilePaths = that.data.src;
    // if (that.data.audioMsg.isupLoad == 1) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '您已提交该回答，不能重复提交哟~',
    //     showCancel: false,
    //     confirmText: '我知道了',
    //     confirmColor: '#6ea8f7'
    //   })
    //   return
    // }
    // if (that.data.audioMsg.length < 30) {
    //   that.alert("您这段录音不足30秒，无法上传哦~");
    //   return
    // } else {
    //   console.log("提交")
    //   wx.showModal({
    //     title: '校对文字确认',
    //     content: '语音已录好,确定上传并进行文字校对',
    //     confirmColor: '#333333',
    //     success: function(res) {
    //       console.log(res)
    //       if (res.confirm) {
    //         that.loading();
    //         console.log('用户点击确定');
    //         that.setData({
    //           progress: 1
    //         })
    wx.uploadFile({
      // url: app.globalData.ip + '?type=save_record&uid=' + that.data.userid + '&question=' + that.data.question + '&time=' + new Date().getTime(),
      url: url ,
   
      filePath: tempFilePaths,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'file',
      formData: that.data.audioMsg,
      success: function(res) {
        var data = JSON.parse(res.data)

        console.log(data.data.id)
        if (data.code == 200) {
          that.setData({
            audioId: data.data.id,
            shadeHiden: false
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          app.alert('上传失败,请重试')
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    })
    //   } else if (res.cancel) {
    //     console.log('用户点击取消');
    //   }
    // }
    // });
    // }
  },
  //校验录音
  getreacr() {
    var that = this
    wx.showLoading({
      title: '音频转译中..',
    })
    that.listenerButtonStop()
    that.setData({
      shadeHiden: true,
      isOpen2: false,
      isOpen: false, //播放开关
      offset: 0,
      starttime: "00:00",
      progress: 1,
    })
    that.data.timOut = setTimeout(function() {
      wx.request({
        // url: app.globalData.ip + '?type=get_record&id=' + that.data.audioId + "&time=" + new Date().getTime(),
        url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/getRecordInfo/',

        data: {
          appid: app.globalData.appid,
          recordid: that.data.audioId,
          time: new Date().getTime()
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: (res) => {
          console.log(res)
          if (res.data.data.status == '0') {
            console.log('成功了')
            that.setData({
              record_txt: res.data.data.record_txt,
            })
            that.getreacr(that.data.audioId)
          } else if (res.data.data.record_fail_num > 0 || res.data.data.status == '3') {
            app.alert("校验失败,请重新校验~")
            wx.hideLoading()
            console.log('失败')
            that.setData({
              shade: false,
              shadeHiden: false
            })
            clearTimeout(that.data.timOut)
            console.log(res.data.data.status)
          } else if (res.data.data.status == '4') {
            console.log('结束')
            // 结束
            that.setData({
              record_txt: res.data.data.record_txt,
              shadeHiden: false,
              shade: false
            })
            wx.hideLoading()
            clearTimeout(that.data.timOut)
          } 
        }
      })
    }, 1000);
  },
  subAudioTxt() {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveExpertAnswer/',
      header: {
        'content-type': 'application/json'
      },
      data: {
        appid: app.globalData.appid,
        userid: that.data.userid,
        recordid: that.data.audioId,
        text: that.data.record_txt
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            progress: 2
          })
          wx.hideToast()
          if(that.data.is_self != 1){
            wx.showModal({
              title: '提交成功！',
              content: '内容审核预计1~3个工作日,请您耐心等待审核结果~',
              confirmText: '继续回答',
              confirmColor: '#333333',
              cancelText: '立即查看',
              cancelColor: '#666666',
              success: function (res) {
                if (res.confirm) {
                  that.nextMsg()
                } else if (res.cancel) {
                  console.log('立即查看');
                  if (that.data.is_self == 1) {
                    wx.redirectTo({
                      url: '../askList/askList'
                    });
                  } else {
                    wx.redirectTo({
                      url: '../answer/answer'
                    });
                  }
                }
              }
            })
          }else{
            wx.showModal({
              title: '提交成功！',
              content: '内容审核预计1~3个工作日,请您耐心等待审核结果~',
              confirmText: '继续设置',
              confirmColor: '#333333',
              cancelText: '立即查看',
              cancelColor: '#666666',
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../ask/ask'
                  });
                } else if (res.cancel) {
                  console.log('立即查看');
                  if (that.data.is_self == 1) {
                    wx.redirectTo({
                      url: '../askList/askList'
                    });
                  } else {
                    wx.redirectTo({
                      url: '../answer/answer'
                    });
                  }
                }
              }
            })
          }
        } else {
          wx.hideToast()
          app.alert('提交失败,请重新提交~')
        }
      }
    })
  },
  goindex() {
    var that = this
    if (that.data.shadeHiden == true) {
      return
    } else {
      that.listenerButtonStop()
      recorderManager.stop();
      clearInterval(that.data.timer)
      wx.hideLoading()
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  // 我已阅读
  read() {
    var that = this
    that.setData({
      tooltip: false
    })
  },
  prompt() {
    app.alert("音频录制不足30秒")
  },
  gowordsToanswe() {
    var that = this
    if (that.data.recording) {
      that.alert('录音中...')
    } else if (that.data.shadeHiden == true) {
      return
    } else {
      that.listenerButtonStop()
      // recorderManager.stop();
      // clearInterval(that.data.timer)
      wx.navigateTo({
        url: '../wordsToanswe/wordsToanswe?id=' + that.data.question,
      })
    }
  },
  onHide(){
    var that = this;
    if (that.data.recording){
      this.pauseRecording()
    }
    
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.title.title, 
      path: '/pages/record/record?is_self=' + that.data.is_self + '&questionId=' + that.data.question,
    }
  },
});