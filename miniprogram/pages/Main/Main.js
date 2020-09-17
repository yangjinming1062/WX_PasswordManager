// miniprogram/pages/Main/Main.js
const fileKey = 'DafaultDB'
const dbKey = 'yunDBID'
const DBName = 'DafaultDB'
const app = getApp()
var PasswordArray = []
var scrollTop = 0
Page({
  data: {
    IsShowJL: true,
    IsShowDQ: false,
    IsShowSM: false,
    inputShowed: false,
    inputVal: "",
    IsUploading: false,
    DBID: null,
    ShowPassword: true,
    columnShow: true,
    HiddenBar: false,
    theme: 'dark',
    ModIndex: -1,
  },
  changeSwitch: function (e) {
    switch (e.target.id) {
      case 'mwmm': this.setData({ ShowPassword: !this.data.ShowPassword }); break;
      case 'slxs': this.setData({ columnShow: !this.data.columnShow }); break;
      case 'mlzt': this.setData({ theme: this.data.theme == 'dark' ? 'light' : 'dark' }); break;
    }
  },
  showInput: function () {
    this.setData({ inputShowed: true });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      ForShowArray: PasswordArray
    });
  },
  clearInput: function () {
    this.setData({ inputVal: "", ForShowArray: PasswordArray })
  },
  delTap: function (e) {
    for (let i = 0; i < PasswordArray.length; i++) {
      if (PasswordArray[i].keyword == e.detail) {
        PasswordArray.splice(i, 1);//移除该项
        break;
      }
    }
    wx.setStorageSync(fileKey, PasswordArray)
    this.setData({ ForShowArray: PasswordArray })
    wx.showToast({
      title: '移除成功',
      duration: 1500,
    })
  },
  modTap: function (e) {
    let index = 0;
    for (let i = 0; i < PasswordArray.length; i++) {
      if (PasswordArray[i].keyword == e.detail) {
        index = i;
        break;
      }
    }
    if (!this.data.IsShowJL) {//防止连续点击
      this.setData({ IsShowJL: true, IsShowDQ: false, IsShowSM: false, 
      App: PasswordArray[index].App, Password: PasswordArray[index].Password,
      Phone: PasswordArray[index].Phone,Email: PasswordArray[index].Email,
      Other: PasswordArray[index].Other, ID: PasswordArray[index].ID, ModIndex: index})
    }
  },
  inputTyping: function (e) {
    switch (e.target.id) {
      case "txtApp": this.setData({ App: e.detail.value }); return;
      case "txtKey": this.setData({ secretKey: e.detail.value }); return;
      case "txtID": this.setData({ ID: e.detail.value }); return;
      case "txtPass": this.setData({ Password: e.detail.value }); return;
      case "txtSearch": this.setData({ inputVal: e.detail.value }); break;
      case "txtPhone": this.setData({ Phone: e.detail.value }); return;
      case "txtEmail": this.setData({ Email: e.detail.value }); return;
      case "txtOther": this.setData({ Other: e.detail.value }); return;
    }
    let SearchArray = []
    PasswordArray.forEach(element => {
      if (element.App.toLowerCase().search(this.data.inputVal.toLowerCase()) >= 0 ||
        element.ID.toLowerCase().search(this.data.inputVal.toLowerCase()) >= 0) {
        SearchArray.push(element);
      }
    });
    this.setData({ ForShowArray: SearchArray })
  },
  JLtap: function (e) {
    if (!this.data.IsShowJL) {//防止连续点击
      this.setData({ IsShowJL: true, IsShowDQ: false, IsShowSM: false, })
    }
  },
  DQtap: function (e) {
    if (!this.data.IsShowDQ) {//防止连续点击
      this.setData({ IsShowJL: false, IsShowDQ: true, IsShowSM: false, })
    }
  },
  SMtap: function (e) {
    if (!this.data.IsShowSM) {//防止连续点击
      this.setData({ IsShowJL: false, IsShowDQ: false, IsShowSM: true, })
    }
  },
  ClearRecord: function () {
    this.setData({ App: "", ID: "", Password: "", Phone: "", Email: "", Other: "", ModIndex: -1})
  },
  RealSaveRecord: function () {
    if(this.data.ModIndex == -1){
      var newRecord = { App: this.data.App, ID: this.data.ID, Phone: this.data.Phone, Email: this.data.Email, Password: this.data.Password, Other: this.data.Other, keyword: new Date().getTime() }
      PasswordArray.push(newRecord)
    }
    else{
      PasswordArray[this.data.ModIndex].App = this.data.App
      PasswordArray[this.data.ModIndex].ID = this.data.ID
      PasswordArray[this.data.ModIndex].Phone = this.data.Phone
      PasswordArray[this.data.ModIndex].Email = this.data.Email
      PasswordArray[this.data.ModIndex].Password = this.data.Password
      PasswordArray[this.data.ModIndex].Other = this.data.Other
      this.setData({ ModIndex: -1 });
    }
    this.setData({ ForShowArray: PasswordArray })
    wx.setStorageSync(fileKey, PasswordArray)
    wx.showToast({
      title: '保存成功！',
      duration: 1500,
    })
    this.ClearRecord()
  },
  SaveRecord: function () {
    if (this.data.ID.length == 0 || this.data.Password.length == 0) {
      wx.showToast({
        title: '保存前请先填写账号与密码',
        icon: 'none',
        duration: 3000,
      })
      return
    }
    if (this.data.App.length == 0) {
      var self = this;//回调里不可以用this
      wx.showModal({
        title: '提示',
        content: '未填写【应用】不利于检索，是否继续保存',
        confirmText: '继续保存',
        cancelText: '返回填写',
        success: function (res) {
          if (res.confirm) {
            self.RealSaveRecord()
          }
        }
      })
    }
    else {
      this.RealSaveRecord()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PasswordArray = wx.getStorageSync(fileKey) || []
    var dbid = wx.getStorageSync(dbKey) || null//判断是否有上传过云端
    this.setData({
      DBID: dbid,
      ForShowArray: PasswordArray,
      ShowYunOps: options.ShowOps == "true",
    })
    if (!app.globalData.openid && options.ShowOps == "true") {
      wx.showModal({
        title: '未检测到用户标识',
        content: '请先登录',
        confirmText: '去登录',
        cancelText: '就不去',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../Login/Login',
            })
          } else if (res.cancel) {
            wx.navigateBack()
          }
        }
      })
    }
    if (options.ShowOps == "true") {
      this.fixQuery()
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPageScroll: function (e) {
    if (this.data.HiddenBar && scrollTop > 0 && e.scrollTop < scrollTop) {
      this.setData({ HiddenBar: false })
    }//非定值监控，而是判断是上拉且tab没有显示就显示出来
    scrollTop = e.scrollTop
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ HiddenBar: true })
  },
  onAdd: function () {
    const db = wx.cloud.database()
    this.setData({ IsUploading: true })
    var updata = this.EnCode()
    if (this.data.DBID == null) {
      db.collection(DBName).add({
        data: updata,
        success: res => {
          this.setData({ DBID: res._id })// 在返回结果中会包含新创建的记录的 _id
          wx.setStorage({ data: res._id, key: dbKey, })//将数据标识记录，方便更新和删除
          wx.showToast({
            title: '上传云端成功',
          })
          this.setData({ IsUploading: false, secretKey: "" })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '上传云端失败'
          })
          this.setData({ IsUploading: false })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
    else {
      db.collection(DBName).doc(this.data.DBID).update({
        data: updata,
        success: res => {
          wx.showToast({
            title: '上传云端成功',
          })
          this.setData({ IsUploading: false, secretKey: "" })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '上传云端失败'
          })
          this.setData({ IsUploading: false })
        }
      })
    }
  },
  fixQuery: function () {
    if (this.data.DBID == null) {//本地没数据可能是换新机
      const db = wx.cloud.database()
      db.collection(DBName).where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          if (res.data.length > 0 && res.data[0]._id) {
            this.setData({ DBID: res.data[0]._id, })
            wx.setStorage({ data: res.data[0]._id, key: dbKey, })
          }
        },
      })
    }
  },
  onQuery: function () {
    this.setData({ IsUploading: true })
    if (this.data.DBID == null) {
      wx.showModal({
        title: '温馨提示',
        content: '阁下似乎还未上传过数据，要不咱先上传一下试试？',
        confirmText: '哦',
        showCancel: false
      })
      return
    }
    const db = wx.cloud.database()
    var self = this
    db.collection(DBName).where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        self.DeCode(res.data)
        this.setData({ IsUploading: false, secretKey: "" })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '读取云端失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
        this.setData({ IsUploading: false })
      }
    })
  },
  onRemove: function () {
    if (this.data.DBID) {
      const db = wx.cloud.database()
      db.collection(DBName).doc(this.data.DBID).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({ DBID: null, secretKey: "" })
          wx.removeStorage({ key: dbKey, })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '删无可删，要不先上传或读取云端记录吧',
      })
    }
  },
  //对输入密码结合用户唯一id进行加密处理，使其他无法通过加密的密码获取用户真实密码
  EnCode: function () {
    let secretLs = []
    PasswordArray.forEach(element => {
      let totalPW = ""
      let key = this.data.secretKey
      for (let i = 0; i < element.Password.length; i++) {
        let num10 = element.Password.charCodeAt(i);
        let keynum = key.charCodeAt(i % key.length);
        let str2 = (num10 + keynum).toString(16)
        if (totalPW == "") {
          totalPW = str2;
        } else {
          totalPW = totalPW + "|" + str2;
        }
      }
      secretLs.push({ App: element.App, ID: element.ID, Phone: element.Phone, Email: element.Email, Password: totalPW, Other: element.Other, keyword: element.keyword })
    });
    return { PLS: secretLs }//云端数据库不允许存数组，加层对象
  },
  //用户登陆后利用唯一id反向解码
  DeCode: function (YunData) {
    PasswordArray = []
    try {
      YunData[0].PLS.forEach(element => {
        let arr = element.Password.split("|")
        let key = this.data.secretKey
        let totalPW = ""
        for (let i = 0; i < arr.length; i++) {
          totalPW += String.fromCharCode(parseInt(arr[i], 16) - key.charCodeAt(i % key.length))
        }
        PasswordArray.push({ App: element.App, ID: element.ID, Phone: element.Phone, Email: element.Email, Password: totalPW, Other: element.Other, keyword: element.keyword })
      });
      this.setData({ ForShowArray: PasswordArray })
      wx.setStorageSync(fileKey, PasswordArray)
      wx.showToast({
        title: '加载云端数据成功',
        duration: 1500,
      })
    }
    catch (err) {
      wx.showModal({
        title: '温馨提示',
        content: '阁下似乎还未上传过数据，要不咱先上传一下试试？',
        confirmText: '哦',
        showCancel: false
      })
      this.setData({ DBID: null, })
      wx.removeStorage({ key: dbKey, })
      console.log(err)
    }
  },
})