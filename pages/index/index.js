//index.js
//获取应用实例
var QQMapWX = require('../../util/qqmap-wx-jssdk.js')  //引入获得地址的js文件
var qqmapsdk;
const app = getApp()

Page({
  data: {
    motto: '进行神奇的漂流瓶冒险之旅',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function (res) {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    console.log(res);
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(res.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      wx.login({
        success: function (res) {
          console.log(res)
          //获取登录的临时凭证
          var code = res.code;
          //调用后端，获取微信的session_key,secret
          wx.request({
            //url: 'http://192.168.0.15:8090/wxLogin?code=' + code,
            url : "",
            data:{code,code},
            method: "POST",
            success: function (result) {
              console.log(result);
              app.setGlobalUserInfo(res.detail.userInfo);
              wx.redirectTo({
                url: '../index/index'
              })
            }
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  onLoad: function (options) {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("用户授权了");
          console.log(res);
        } else {
          //用户没有授权
          console.log("用户没有授权");
        }
      }
    });
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      wx.getLocation({
                        type: 'wgs84',
                        success: res => {
                          console.log(res);
                          // var speed = res.speed,
                          // var accuracy = res.accuracy,
                          // var latitude = res.latitude,
                          // var longitude = res.longitude
                          //地址解析
                          qqmapsdk = new QQMapWX({
                            key: '27JBZ-Q6FWU-AJMVW-BEHAY-YE5SQ-CRF7Q'// 腾讯位置服务的申请密钥
                          });
                          console.log('地址解析');
                          qqmapsdk.reverseGeocoder({//地址解析
                            location: {
                              latitude: res.latitude,
                              longitude: res.longitude
                            },
                            success: function (res) {
                              console.log(res);
                               //获得地址
                              // that.setData({
                              //   address: res.result.address
                              // })
                            },
                            fail: function (res) {
                              console.log(res);
                            },
                            complete: function (res) {
                              console.log(res);
                            }
                          });
                          // this.setData({
                          //   location: res,
                          // })
                          // console.log(app.globalData.location);
                        },
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          wx.getLocation({
            type: 'wgs84',
            success: res => {
              console.log(res);
              // this.setData({
              //   location: res,
              // })
              // console.log(app.globalData.location);
            },
          })
        }
        else {
          //调用wx.getLocation的API
          wx.getLocation({
            type: 'wgs84',
            success: res => {
              console.log(res);
              // var speed = res.speed,
              // var accuracy = res.accuracy,
              // var latitude = res.latitude,
              // var longitude = res.longitude
              //地址解析
              qqmapsdk = new QQMapWX({
                key: '27JBZ-Q6FWU-AJMVW-BEHAY-YE5SQ-CRF7Q'// 腾讯位置服务的申请密钥
              });
              console.log('地址解析');
              qqmapsdk.reverseGeocoder({//地址解析
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success: function (res) {
                  console.log(res);
                  //获得地址
                  // that.setData({
                  //   address: res.result.address
                  // })
                },
                fail: function (res) {
                  console.log(res);
                },
                complete: function (res) {
                  console.log(res);
                }
              });
              // this.setData({
              //   location: res,
              // })
              // console.log(app.globalData.location);
            },
          })
        }
      }
    })
  },
})
