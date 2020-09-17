//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    EggCount:0,
    Tel:"鬼才告诉你",
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'启动失败',
        content:'很抱歉，因当前环境或微信版本无法连接到云端，启动失败了……',
        confirmText:'朕已阅，退下吧',
        cancelText: '朕不管，无所谓',
        success:function(res){
          if(res.confirm){
            wx.navigateBack({
              complete: (res) => {},
            })
          }else if (res.cancel) {
            
          }
        }
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  offLine:function(){
    wx.navigateTo({
      url: '../Main/Main?ShowOps=false',
    })
  },
  onGetOpenid: function() {
    this.setData({IsIntoboxing:true})
    if(app.globalData.openid!= null)
    {
      console.log('已获取OpenID登录: ', app.globalData.openid)
      wx.redirectTo({
        url: '../Main/Main?ShowOps=true',
      })
      return;
    }
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.redirectTo({
          url: '../Main/Main?ShowOps=true',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '登录云端失败',
          icon:'none',
          duration:1500,
        })
      }
    })
  },
  openAbout:function(){
    wx.navigateTo({
      url: '../AboutMe/AboutMe',
    })
  },
  Egg:function()
  {
    this.data.EggCount+=1;
    if(this.data.EggCount>10)
      return;
    var msg="";
    switch(this.data.EggCount)
    {
      case 1:msg="这是一个小小的恶趣味~";break;
      case 2:msg="咦~你怎么还点";break;
      case 3:msg="不要点了，点我也没用";break;
      case 4:msg="哎，你真是个执着的人呢";break;
      case 5:msg="好吧，我的联系方式告诉你了";
      this.setData({Tel:"18304010715（手机、微信）"});
      return;
      default:msg="都告诉你了怎么还点……没了，结束了";break;
    }
    wx.showToast({
      title: msg,
      icon:'none',
      duration:1500,
    })
  },
  onShareAppMessage: function () {//转发按钮点击事件
    return {
      title: '自从用了这个小程序，再也不用担心忘记密码或把密码记混了！',
    }
  }
})
