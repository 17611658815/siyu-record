// pages/feedback/feedback.js
var app = getApp();
Page({
  data: {
    imgs: [],//本地图片地址数组
    picPaths:[],
    message: '',
    submitTime: 1,
    userid: '',
    tempFilePaths: {},//本地图片地址对象
    canChoose: true,//是否可选图片
    imgString: '',//图片拼接后的字符串
  },
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync('userinfo') || null
    var userid = user.id != undefined ? user.id : wx.getStorageSync('uid');
    console.log(userid)
    if (user == null){
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
    that.setData({
      userid: userid,
    });
  },
  delete1(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.data.imgs.splice(index, 1);
    that.data.picPaths.splice(index, 1)
    that.setData({
      imgs: that.data.imgs,
      picPaths: that.data.picPaths
    })
    console.log(that.data.picPaths)
  },
  savemessage: function (e) {
    var that = this;
    that.setData({
      message: e.detail.value
    })
  },
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  noChoose: function () {
    var that = this;
    that.alert("最多只能上传9张哦~")
  },
  // 选取图片
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var imgsLimit = [];
        var tempFilePaths = that.data.tempFilePaths;
        var imgs = that.data.imgs;
        console.log(res.tempFilePaths);
        that.upImgs(res.tempFilePaths[0], 0, 2)
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          tempFilePaths[res.tempFilePaths[i]] = '';
          console.log(res.tempFilePaths[i])
          imgs.push(res.tempFilePaths[i]);
        };
        if (imgs.length > 6) {
          for (var i = 0; i < 6; i++) {
            imgsLimit.push(imgs[i]);
          }
          that.setData({
            imgs: imgsLimit,
            tempFilePaths: tempFilePaths,
          });
        } else {
          that.setData({
            imgs: imgs,
            tempFilePaths: tempFilePaths,
          });
        }
      },
    })
  },
  upImgs: function (imgurl, index, type) {
    var that = this;
    wx.uploadFile({
      url: 'https://mfkapi.39yst.com/appInterface/common/upImgFile',
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        appid:app.globalData.appid,
        
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        if (that.data.imgs[index] != undefined) {//存在下一张
          that.data.picPaths.push(data['url'])
          that.setData({
            picPaths: that.data.picPaths
          })
          console.log(that.data.picPaths)
        }
      }
    })
  },
  checkMessage: function (message) {
    var that = this;
    if (message.length == 0) {
      that.alert("您还没有输入内容哦！");
      that.setData({
        submitTime: 1,
      });
      return false;
    }
    return true;
  },
  // submitMessage: function () {
  //   var that = this;
  //   var imgsPaths = that.data.imgs;
  //   var message = that.data.message;
  //   if (imgsPaths.length > 9) {
  //     that.alert('最多只能上传9张图片哦~')
  //   } else if (that.checkMessage(message)) {
  //     that.setData({
  //       submitTime: 0,
  //     });
  //     that.loading();
  //     if (imgsPaths.length > 0) {
  //       that.upImgs(imgsPaths[0], 0);
  //     } else {
  //       that.upMessage();
  //     }
  //   };
  // },
  upMessage: function () {
    var that = this;
    if (that.data.message == ''){
      app.alert('提交内容不能为空~')
      return
    }else{
      that.loading();
      var imgString = that.data.picPaths.join(',');
      wx.request({
        url:"https://mfkapi.39yst.com/appInterface/mfkdoctor/saveMessage/",
        data:{
          appid:app.globalData.appid,
          userid: that.data.userid,
          message: that.data.message,
          images: imgString
        },
        method:"POST",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.res == 'false') {
            that.alert(res.data.msg);
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function () {
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          }
        },
        complete: function () {// complete
          wx.hideToast();
        }
      });
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
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康医生-意见反馈',
      path: '/pages/feedback/feedback',
    }
  },
})