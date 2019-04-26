// pages/audioMsg/audioMsg.js
var app = getApp();
var innerAudioContext = wx.createInnerAudioContext(); //音频播放
Page({
  /**
   * 页面的初始数据
   */
  data: {
    minute: "00", //分
    second: "00", //秒
    isPucse: true,
    isPlay: false,

    src: '', //试听路径
    isOpen2: false,
    isOpen: false, //播放开关
    offset: 0, //进度条
    starttime: '00:00',
    
    doctor: {
      pic: '',
      name: '',
      hospital: '',
      department: '',
      introduction: '',
      doctor_rank:''
    },
    array: ['主任', '副主任', '主治', '医师', '教授', '高级营养师', '中级营养师', '初级营养师', '康复师'], //客服
    index: 0,
    id: '', //问题id
    title: '', //问题标题
    created: '', //上传时间
    durations: "00:00", //默认播放音频时长
    answer_txt: '', //音频文字内容
    status: '',
    message: '', //审核失败原因
    is_self:'',
    question:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var id = options.question;
    var is_self = options.is_self;
    console.log(options)
    that.setData({ 
      is_self: is_self,
      question: id
      })
    var userinfo = wx.getStorageSync('userinfo') || {};
    var phone = wx.getStorageSync('phone');
    if (JSON.stringify(userinfo) == "{}") {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    
    that.getDocterMsg(phone); //获取医生信息
    that.getQuestion(id); //获取问题信息
    
  },
  getQuestion(id) {
    var that = this
    wx.request({
      // url: app.globalData.ip + '?type=get_record&id=' + id,
      url:'https://mfkapi.39yst.com/appInterface/mfkdoctor/getRecordInfo/',
      data:{
        appid:app.globalData.appid,
        recordid:id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        that.setData({
          title: res.data.data.title,
          created: res.data.data.record_time,
          durations: res.data.data.duration,
          answer_txt: res.data.data.answer_txt,
          status: res.data.data.status,
          message: res.data.data.message,
          id: res.data.data.id,
          src: res.data.data.record,
        })
      }
    })
  },
  onHide() {
    var that = this
    that.listenerButtonStop()
    console.log('离开onHide')
  },
  onUnload() {
    var that = this
    that.listenerButtonStop()
    console.log('离开onUnload')
  },
  anewRecord() {
    var that = this
    if (that.data.is_self == undefined) {
      console.log('有声问答')
      wx.navigateTo({
        url: '/pages/record/record?questionId=' + that.data.id,
      })
    } else {
      console.log('自问自答')
      wx.navigateTo({
        url: '/pages/record/record?questionId=' + that.data.id + '&is_self=' + that.data.is_self,
      })
    }

  },
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
      method: 'POST',
      success: (res) => {
        console.log(res)
        that.data.doctor.name = res.data.msg.name;
        that.data.doctor.hospital = res.data.msg.hospital;
        that.data.doctor.department = res.data.msg.department;
        that.data.doctor.mobile = res.data.msg.mobile;
        that.data.doctor.identity_code = res.data.msg.identity_code;
        that.data.doctor.describe = res.data.msg.describe;
        that.data.doctor.introduction = res.data.msg.introduction;
        that.data.doctor.doctor_rank = res.data.msg.doctor_rank;
        that.data.doctor.pic = res.data.msg.avatar
        that.setData({
          doctor: that.data.doctor,
          index: that.data.index,
        })

      }
    })
  },
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
  //继续播放
  Play() {
    var that = this
    innerAudioContext.play();
    that.setData({
      isOpen2: false
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.title,
      path: '/pages/audioMsg/audioMsg?question=' + that.data.question,
    }
  },
})