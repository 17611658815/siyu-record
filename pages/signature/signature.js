// canvas 全局配置
var util = require('../../utils/util.js');
var context = null;
var context2 = null;
var context3 = null;
var context4 = null;
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
var rpx
var posterHeight = 0
var posterWidth = 0
var avatarPadding = 0 //距离边界
var avatarRadiu = 0 //头像半径
var textScale = 0 //文字比例
var app = getApp()
//注册页面
Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  //开始
  canvasStart: function (event) {
    console.log(event)
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  },
  data: {
    canshow: true,
    canshow2: false,
    img: "../../images/authorization.jpg",
    txt: '测试',
    name: '',
    myCanvasWidth: 0,
    myCanvasHeight: 0,
    posterHeight: 0,
    imgArray: [],
    signShow:true,
    time:'',
    name:'',
    idCad:'',
    phone:'',
    position:'',
    top: '0',
    left: '0',
    protocol:[],
    hospitalInfo:'',
    deskInfo:'',
    namepic:'',
    array: ['主任', '副主任', '主治', '医师', '教授', '高级营养师', '中级营养师', '初级营养师', '康复师'],
    title:''
  },

  onLoad: function (options) {
    var that = this
    console.log(options)
    var docInfo = app.docInfo
    var time = util.formatTime(new Date());
  
    this.setData({
      time: time,
      name: docInfo.userInfo,
      
      // idCad: docInfo.idcard,
      // hospitalInfo: docInfo.hospitalInfo ,
      // deskInfo: docInfo.deskInfo,
      // title: that.data.array[docInfo.titleInfo/1-1]

      //  time: '2018年12月7日',
      // name: '李嘉豪',
      // idCad: '410611199601126530',
      // hospitalInfo: '北京天坛医院',
      // deskInfo: '骨科',
      // title: '主任'
    });  
    console.log(that.data.title)
    var myCanvasWidth = that.data.myCanvasWidth
    var myCanvasHeight = that.data.canvasHeight
    context = wx.createCanvasContext('canvas');//签字画布
    context2 = wx.createCanvasContext('canvas2');//签名页画布

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        myCanvasWidth = res.screenWidth
        myCanvasHeight = res.screenHeight
        posterWidth = Math.round(res.screenWidth * 0.68)
        posterHeight = Math.round(posterWidth * 1920 / 1080)
        avatarPadding = Math.round(posterWidth * 20 / 375)
        avatarRadiu = Math.round(posterWidth * 25 / 375)
        textScale = Math.round(posterWidth / 375)
        rpx = res.windowWidth / 375;
        that.setData({
          myCanvasWidth: myCanvasWidth,
          myCanvasHeight: myCanvasHeight,
          posterHeight: posterHeight
        })
        if (res.model == 'iPhone X') {
          context2.drawImage(that.data.img, 0, 0, that.data.myCanvasWidth, 700 * rpx);
          context2.setFontSize(textScale * 15)
          context2.fillText(that.data.name, 80 * rpx, 120 * rpx, 300 * rpx);
          // context2.fillText(that.data.idCad, 90 * rpx, 145 * rpx, 300 * rpx);
          // context2.fillText(that.data.hospitalInfo, 90 * rpx, 170 * rpx, 300 * rpx);
          // context2.fillText(that.data.deskInfo, 70 * rpx, 205 * rpx, 300 * rpx);
          // context2.fillText(that.data.title, 250 * rpx, 205 * rpx, 300 * rpx);
          context2.fillText(that.data.time, 80 * rpx, 655 * rpx, 300 * rpx); 
         
          context2.draw();
         

        } else {
          context2.drawImage(that.data.img, 0, 0, that.data.myCanvasWidth, 700 * rpx);
          context2.setFontSize(textScale * 15)
          context2.fillText(that.data.name, 80 * rpx, 120 * rpx, 300 * rpx);
          // context2.fillText(that.data.idCad, 90 * rpx, 145 * rpx, 300 * rpx); 
          // context2.fillText(that.data.hospitalInfo, 90 * rpx, 170 * rpx, 300 * rpx); 
          // context2.fillText(that.data.deskInfo, 70 * rpx, 205 * rpx, 300 * rpx); 
          // context2.fillText(that.data.title, 250 * rpx, 205 * rpx, 300 * rpx); 
          context2.fillText(that.data.time, 80 * rpx, 655 * rpx, 300 * rpx); 
          
       
          context2.draw();
         
        }
      },
    })

    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.draw();
    // 获取图片尺寸
    // wx.getImageInfo({
    //   src: that.data.img,
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       canvasimgw:res.width,
    //       canvasimgh:res.height
    //     })
    //   }
    // });

  },
  
  // 点击签字
  addname() {
    var that = this
    that.cleardraw()
    that.setData({
      canshow: false,
      canshow2: true,
    })

  },
  loadimg() {
    var that = this
    wx.showLoading({
      title: '上传中...',
    })
    wx.canvasToTempFilePath({
      canvasId: 'canvas2',
      fileType: 'jpg',
      success: function (res) {
        console.log(res)
        that.data.imgArray.push(res.tempFilePath)
        that.upImgs(that.data.imgArray[0], 0)
      }
    })
  },
  // loadimg3() {
  //   var that = this
    
  //   context3 = wx.createCanvasContext('canvas4');
  //   wx.canvasToTempFilePath({
  //     canvasId: 'canvas4',
  //     fileType: 'jpg',
  //     success: function (res) {
  //       console.log(res)
  //       that.data.imgArray.push(res.tempFilePath)
  //       wx.hideLoading()
  //       wx.setStorage({
  //         key: 'xyMsg',
  //         data: that.data.imgArray,
  //       })
  //       if(res){
  //         wx.navigateBack({
  //           delta: 1
  //         })
  //       }

  //     }
  //   })
  // },
  // loadimg2() {
  //   var that = this
  //   wx.canvasToTempFilePath({
  //     canvasId: 'canvas3',
  //     fileType: 'jpg',
  //     success: function (res) {
  //       console.log(res)
  //       that.loadimg3()
  //       that.upImgs(that.data.imgArray[0], 0)
  //       that.data.imgArray.push(res.tempFilePath)
  //       wx.setStorage({
  //         key: 'xyMsg',
  //         data: that.data.imgArray,
  //       })
  //       console.log(that.data.imgArray)
  //     }
  //   })
  // },
  //签字过程
  canvasMove: function (event) {
    var that = this
    if (isButtonDown) {
      arrz.push(1);
      console.log(event)
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
    };
    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      };
    };
    context.clearRect(0, 0, canvasw, canvash);
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    context.draw(false);
  },
  //确认签名
  clickMe: function () {
    var that = this
    if (arrx.length == 0) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return false;
    };
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      fileType: 'jpg',
      success: function (res) {
        console.log(res)
        that.setData({
          namepic: res.tempFilePath,
          canshow: true,
          canshow2: false,
          signShow:false,
        })
        wx.getSystemInfo({
          success: function (res) {
            console.log(res)
            if (res.model == "iPhone X") {
              context2.drawImage(that.data.img, 0, 0, that.data.myCanvasWidth, 700 * rpx);
              context2.setFontSize(textScale * 15)
              context2.fillText(that.data.name, 80 * rpx, 120 * rpx, 300 * rpx);
              // context2.fillText(that.data.idCad, 90 * rpx, 145 * rpx, 300 * rpx);
              // context2.fillText(that.data.hospitalInfo, 90 * rpx, 170 * rpx, 300 * rpx);
              // context2.fillText(that.data.deskInfo, 70 * rpx, 205 * rpx, 300 * rpx);
              // context2.fillText(that.data.title, 250 * rpx, 205 * rpx, 300 * rpx);
              context2.fillText(that.data.time, 80 * rpx, 655 * rpx, 300 * rpx); 
              context2.drawImage(that.data.namepic, posterWidth / 375 * 100, posterWidth / 375 * 840, posterWidth / 390 * 200, posterWidth / 390 * 100);
              context2.draw();
            } else {
              context2.drawImage(that.data.img, 0, 0, that.data.myCanvasWidth, 700 * rpx);
              context2.setFontSize(textScale * 15)
              context2.fillText(that.data.name, 80 * rpx, 120 * rpx, 300 * rpx);
              // context2.fillText(that.data.idCad, 90 * rpx, 145 * rpx, 300 * rpx);
              // context2.fillText(that.data.hospitalInfo, 90 * rpx, 170 * rpx, 300 * rpx);
              // context2.fillText(that.data.deskInfo, 70 * rpx, 205 * rpx, 300 * rpx);
              // context2.fillText(that.data.title, 250 * rpx, 205 * rpx, 300 * rpx);
              context2.fillText(that.data.time, 80 * rpx, 655 * rpx, 300 * rpx); 
              // context2.drawImage(that.data.img3, 0, 0, that.data.myCanvasWidth, that.data.myCanvasHeight);
              context2.drawImage(that.data.namepic, posterWidth / 375 * 100, posterWidth / 375 * 840, posterWidth / 390 * 200, posterWidth / 390 * 100);
              context2.draw();
            }
          }
        })

      }
    })
  },
  //保存画布图片本地路径
  clickMe2: function () {
    var that = this
    if (that.data.signShow == true){
      app.alert('请签名,在生成合同')
    }else{
      that.loadimg()
    }
   
  },
  upImgs: function (imgurl, index) {
    var that = this;
    wx.showLoading({
      title: '生成中...',
    })
    wx.uploadFile({
      url: 'https://mfkapi.39yst.com/appInterface/common/upImgFile',
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: {
        appid: app.globalData.appid,
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
      
        var protocol = that.data.protocol
        var data = JSON.parse(res.data)
        console.log(data['url']);
        that.data.protocol.push(data['url'])
        that.setData({ protocol: that.data.protocol})
        wx.setStorage({
          key: 'protocol',
          data: that.data.protocol,
        })
        if (data['code'] == 200) {
          wx.hideLoading()
          if (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        } else if (data['url'] == false) {
          wx.hideLoading()
          app.alert('上传失败,重新上传')
        }
        console.log()
      }
    })
  },
  canvasEnd: function (event) {
    isButtonDown = false;
  },
  //清除画布
  cleardraw: function () {
    arrx = [];
    arry = [];
    arrz = [];
    context.draw(false);
  },

})