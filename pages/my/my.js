//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    entrance: '首页',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    var self = this;
    if (app.globalData.userInfo) {
      self.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (self.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        self.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          self.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 获取个人信息
   */
  getUserInfo: function(e) {
    var self = this;
    app.globalData.userInfo = e.detail.userInfo
    self.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 跳转到地址管理
   */
  adderss: function() {
    var self = this;
    var loginUser = app.globalData.loginUser;
    if (loginUser == "" || loginUser == null) {
      util.isLogin();
    } else {
      wx.navigateTo({
        url: '../home/address/address?entrance=' + self.data.entrance,
      })
    }
  },
  /**
   * 跳转到我的订单
   */
  oder: function() {
    var loginUser = app.globalData.loginUser;
    if (loginUser == "" || loginUser == null) {
      util.isLogin();
    } else {
      wx.navigateTo({
        url: '../home/order/order'
      })
    }
  },
  /**
   * 客户绑定
   */
  customerBind: function() {
    wx.navigateTo({
      url: '../my/login/login'
    });
  }
})