// pages/nextStep/nextStep.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [], //照片
    imgs2: [], //身份证
    imgs3: [], //执业证
    imgs4: [], //职称证
    tempFilePaths: {}, //本地图片地址对象
    imgString: '', //图片拼接后的字符串
    canChoose: true, //是否可选图片
    //三证信息
    docInfo: {
      userPic: '',
      idcard: [],
      zhiyezheng: [],
      zhicheng: '',
      self_video: '', //认证视频
      xyImg: [],
    },
    showModel: false,
    isY: true,
    windowHeight: "",
    windowWidth: "",
    //文字信息
    doctor: {
      userInfo: '',
      identity_code: '',
      hospital: '',
      department: '',
      doctor_rank: '',
      mobile: '',
      describe: '',
      introduction: '',
      adept: '',
    },
    adept: '',
    name: '',
    iphoneX: true,

    videoRecording: false, //录视频
    tempThumbPath: "", // 录制视频的临时缩略图地址
    tempVideoPath: "", // 录制视频的临时视频地址
    camera: false,
    ctx: {},
    startRecord: false,
    topRecord: false,
    time: 0,
    timeLoop: "",
    on_off: false,
    videoUrl: '',
    autoHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    that.data.docInfo2 = app.docInfo;
    console.log(that.data.docInfo2)
    var userinfo = wx.getStorageSync('userinfo') || {};
    var phone = wx.getStorageSync('phone')
    //保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        if (res.model.search('iPhone X') != -1) {
          console.log('iPhone X')
          that.setData({
            iphoneX: false
          })
        }
      }
    })
    that.getDocterMsg(phone)
  },
  onShow() {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          ctx: wx.createCameraContext(),
          autoHeight: ((res.windowWidth) / 16) * 9
        });
      }
    })
    var tiemer = setInterval(function () {
      var signImg = wx.getStorageSync('protocol');
      that.setData({
        "docInfo.xyImg": signImg,
      })
      if (that.data.docInfo.xyImg != '') {
        clearInterval(tiemer)
      }
    }, 300);
  },
  //检查授权
  checkauth: function () {
    var that = this;
    console.log('开始授权')
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: "scope.camera",
            success: function (res) {
              that.getVideo()
            },
            fail: function (res) {
              if (res.errMsg == 'authorize:fail auth deny') { //用户拒绝授权，需删除小程序重新进入授权
                console.log('去开启授权')
              }
            },
            complete: function (res) {
              console.log('complete')
            },
          });

        } else {
          that.getVideo()
        }
      }
    })
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
        that.data.doctor.userInfo = res.data.msg.name;
        that.data.doctor.adept = res.data.msg.adept;
        that.data.doctor.hospital = res.data.msg.hospital;
        that.data.doctor.department = res.data.msg.department;
        that.data.doctor.mobile = res.data.msg.mobile;
        that.data.doctor.identity_code = res.data.msg.identity_code;
        that.data.doctor.describe = res.data.msg.describe;
        that.data.doctor.introduction = res.data.msg.introduction;
        that.data.index = res.data.msg.doctor_rank,
          that.data.userInfoAvatar = res.data.msg.avatar,

          // 三证回显
          that.data.imgs[0] = res.data.msg.avatar,
          that.data.imgs2[0] = res.data.msg.identity,
          that.data.imgs2[1] = res.data.msg.identity2,
          that.data.imgs3 = res.data.msg.qualification.split(","),
          that.data.imgs4[0] = res.data.msg.title,

          that.data.docInfo.userPic = res.data.msg.avatar,
          that.data.docInfo.idcard[0] = res.data.msg.identity,
          that.data.docInfo.idcard[1] = res.data.msg.identity2,
          that.data.docInfo.zhiyezheng = res.data.msg.qualification.split(","),
          that.data.docInfo.zhicheng = res.data.msg.title,
          that.data.docInfo.self_video = res.data.msg.self_video

        that.setData({
          doctor: that.data.doctor,
          msg: res.data.msg,
          imgs: that.data.imgs,
          imgs2: that.data.imgs2,
          imgs3: that.data.imgs3,
          imgs4: that.data.imgs4,
          docInfo: that.data.docInfo
        })

      }
    })
  },
  goreview() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  submitMsg() {
    var that = this
    if (that.data.docInfo.userPic == '') {
      that.alert('请上传您的工作照');
      return false;
    }
    else if (that.data.docInfo.idcard.length < 1) {
      that.alert('请上传身份证信息');
      return false;
    } else if (that.data.docInfo.zhiyezheng.length < 1) {
      that.alert('请上传执业证');
      return false;
    } else if (that.data.docInfo.zhicheng == '') {
      that.alert('请上传职称证');
      return false;
    } else if (that.data.docInfo.self_video == '') {
      that.alert('请上传视频简介');
      return false;
    }
    else if (that.data.docInfo.xyImg == '') {
      that.alert('请签署授权协议');
      return false;
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.request({
        url: 'https://mfkapi.39yst.com/appInterface/mfkdoctor/saveExpertInfo/',
        data: {
          appid: app.globalData.appid,
          name: that.data.doctor.userInfo,
          mobile: that.data.doctor.mobile,
          hospital: that.data.doctor.hospital,
          department: that.data.doctor.department,
          adept: that.data.doctor.adept,
          identity_code: that.data.doctor.identity_code,
          doctor_rank: that.data.doctor.doctor_rank,
          title: that.data.docInfo.zhicheng,
          qualification: that.data.docInfo.zhiyezheng.join(','),
          cooperation: that.data.docInfo.xyImg[0],
          identity: that.data.docInfo.idcard[0],
          identity2: that.data.docInfo.idcard[1],
          is_edit: 1,
          organization: 1,
          avatar: that.data.docInfo.userPic,
          self_video: that.data.docInfo.self_video
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log(res.data);
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              showModel: true
            })
          } else {
            app.alert("提交失败");
          }

        }
      })
    }
  },
  removePic(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      that.data.imgs.splice(index, 1);
      that.setData({
        imgs: that.data.imgs,
        'docInfo.userPic': ''
      })
    } else if (type == 2) {
      that.data.imgs2.splice(index, 1);
      that.data.docInfo.idcard.splice(index, 1)
      that.setData({
        imgs2: that.data.imgs2,
        docInfo: that.data.docInfo
      })
    } else if (type == 3) {
      that.data.imgs3.splice(index, 1);
      that.data.docInfo.zhiyezheng.splice(index, 1)
      that.setData({
        imgs3: that.data.imgs3,
        docInfo: that.data.docInfo
      })
    } else {
      that.data.imgs4.splice(index, 1);
      that.setData({
        imgs4: that.data.imgs4,
        'docInfo.zhicheng': ''
      })
    }
  },
  alert(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  goAgreement: function () {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },
  chooseImageTap: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        console.log(res)
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album', type)
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera', type)
          }
        }
      }
    })
  },
  // 选取图片
  chooseWxImage: function (type, typeNum) {
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        if (typeNum == 1) {
          var imgs = that.data.imgs;
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            tempFilePaths[res.tempFilePaths[i]] = '';
            console.log(res.tempFilePaths[i])
            imgs.push(res.tempFilePaths[i]);
            console.log(imgs)
          };
          var imgs = that.data.imgs;
          that.upImgs(res.tempFilePaths[0], 0, 0)
          that.setData({
            imgs: imgs,
          });
        } else if (typeNum == 2) {
          var imgs = that.data.imgs2;
          that.upImgs(res.tempFilePaths[0], 0, 1)
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            tempFilePaths[res.tempFilePaths[i]] = '';
            console.log(res.tempFilePaths[i])
            imgs.push(res.tempFilePaths[i]);
            console.log(imgs)
          };
          that.setData({
            imgs2: imgs,
          });
        } else if (typeNum == 3) {
          var imgs = that.data.imgs3;
          that.upImgs(res.tempFilePaths[0], 0, 2)
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            tempFilePaths[res.tempFilePaths[i]] = '';
            console.log(res.tempFilePaths[i])
            imgs.push(res.tempFilePaths[i]);
          };
          that.setData({
            imgs3: imgs,
          });
        } else {
          var imgs = that.data.imgs4;
          that.upImgs(res.tempFilePaths[0], 0, 3)
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            tempFilePaths[res.tempFilePaths[i]] = '';
            imgs.push(res.tempFilePaths[i]);
          };
          that.setData({
            imgs4: imgs,
          });
        }
      }
    })
  },
  upImgs: function (imgurl, index, type) {
    var that = this;
    wx.showLoading({
      title: '上传中',
      mask: true,
    })
    wx.uploadFile({
      url: 'https://mfkapi.39yst.com/appInterface/common/upImgFile',
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        appid: app.globalData.appid,
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data);
        if (data['code'] == 200 && type == 0) {
          that.setData({
            "docInfo.userPic": data['url'],
            listShow: true
          })
          wx.hideLoading()
          console.log(that.data.docInfo)
        } else if (data['code'] == 200 && type == 1) {
          that.data.docInfo.idcard.push(data['url'])
          that.setData({
            docInfo: that.data.docInfo
          })
          wx.hideLoading()
          console.log(that.data.docInfo)
        } else if (data['code'] == 200 && type == 2) {

          console.log(that.data.docInfo)
          that.data.docInfo.zhiyezheng.push(data['url'])
          that.setData({
            docInfo: that.data.docInfo
          })
          wx.hideLoading()
          console.log(that.data.docInfo)

        } else if (data['code'] == 200 && type == 3) {
          that.setData({
            "docInfo.zhicheng": data['url']
          })
          wx.hideLoading()
          console.log(that.data.docInfo)
        } else if (data['url'] == false) {
          wx.hideLoading()
          app.alert('上传失败,重新上传')
        }
      }
    })
  },
  // 视频录制
  // 去录视频
  getVideo() {
    this.setData({
      videoRecording: true
    })
  },

  // 开始录制
  camera() {
    let {
      ctx,
      type,
      startRecord
    } = this.data;
    if (!startRecord) {
      console.log("开始录视频");
      this.setData({
        startRecord: true
      });
      // 30秒倒计时
      let t1 = 0;
      let timeLoop = setInterval(() => {
        t1++;
        this.setData({
          time: t1,
        })
        // 最长录制30秒
        if (t1 == 10) {
          clearInterval(timeLoop);
          this.stopRecord(ctx);
        }
      }, 1000);
      this.setData({
        timeLoop
      })
      // 开始录制
      ctx.startRecord({
        success: (res) => {
          console.log(res);
        },
        fail: (e) => {
          console.log(e);
        }
      })
    } else {
      this.stopRecord(ctx);
    }
  },
  // 停止录制
  stopRecord(ctx) {
    console.log("停止录视频");
    wx.showLoading({
      title: '加载中..',
    })
    clearInterval(this.data.timeLoop);
    ctx.stopRecord({
      success: (res) => {
        this.setData({
          tempThumbPath: res.tempThumbPath,
          tempVideoPath: res.tempVideoPath,
          camera: false,
          startRecord: false,
          topRecord: true,
          time: 0
        }, () => {
          wx.hideLoading()
        });
      },
      fail: (e) => {
        console.log(e);
      }
    })
  },
  // 上传视频
  saveFale() {
    let that = this
    wx.showLoading({
      title: '上传中..',
      mask: true
    })
    that.setData({
      on_off: true
    })
    wx.uploadFile({
      url: 'https://mfkapi.39yst.com/appInterface/common/upVideoFile',
      filePath: that.data.tempVideoPath,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'file',
      formData: {
        appid: app.globalData.appid,
      },
      success(res) {
        console.log(res.statusCode)
        if (res.statusCode !== 200) {
          app.alert('上传失败,请重新上传')
          wx.hideLoading()
        } else {
          console.log(res)
          var data = JSON.parse(res.data)
          that.setData({
            videoRecording: false,
            'docInfo.self_video': data['url']
          })
        }
      },
      fail() {
        app.alert('上传失败,请重新上传')
      },
      complete() {
        console.log('1111')
        that.setData({
          on_off: false
        }, () => {
          wx.hideLoading()
        })

      }
    })
  },
  open(e) {
    let {
      type
    } = e.target.dataset;
    this.setData({
      camera: true,
      type
    })
  },
  gosignature() {
    app.docInfo = this.data.doctor
    wx.navigateTo({
      url: '/pages/signature/signature',
    })
  },
})