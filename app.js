//app.js
App({
  onLaunch: function () {
    var self = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
       // console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //console.log(res);
              // 获取签名
              //console.log(res.signature);
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (self.userInfoReadyCallback) {
                self.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    /**
   * 获取网络状态
   */
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        self.globalData.networkState = true;
        if (res.networkType == "none") {
          self.globalData.networkState = false;
        }
      }
    })
     /**
   * 监听网络状态变化
   */
    wx.onNetworkStatusChange(function (res) {
      self.globalData.networkState = res.isConnected
    })
    /**
     * 获取当前登陆用户手机号码
     */
    wx.getStorage({
      key: 'UserName',
      success: function (res) {
        self.globalData.loginUser = res.data
      }
    })

    /**
     * 获取是否同意发货条款状态
     */
    wx.getStorage({
      key: 'agreement',
      success: function (res) {
        self.globalData.agreement = res.data
      }
    })
  },
  // 定义了全局数据对象，GlobalData可以随时在页面中读取和存储数据，
  // 在小程序的所有页面中都可以随时调用和写入存放在GlobalData的数据。
  // 无论是调用还是写入，第一步都是要让页面与App.js产生关联。所以在页面的对应的JS中，第一句话就要写上： var app = getApp();  
  globalData: {   
    userInfo: null ,
    networkState: null, 
    loginUser: null,
    agreement:false
  }
})