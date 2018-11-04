//index.js
const http = require('../../utils/http.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    entrance:'首页',
    isRecord: false,
    oddNumbers:'',
    isSearch: true,
    sendInifList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 根据状态变图标
   */
  iconStatus:function(){
    var that = this;
    // 根据状态显示图标
    var sendInifList = that.data.sendInifList;
    for (var i = 0; i < sendInifList.length; i++) {
      if (sendInifList[i].status == "待揽件") {
        sendInifList[i].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_etc@2x.png";
      } else if (sendInifList[i].status == "运输中") {
        sendInifList[i].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_tran@2x.png";
      } else if (sendInifList[i].status == "已签收") {
        sendInifList[i].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_signed@2x.png";
      }
    }
    that.setData({
      sendInifList: sendInifList,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'UserName',
      success: function (res) {
        var params = new Object();
        params.name = res.data;
        http.POST({
          url: "WeChatAutoOrderNO",
          params: params,
          success: function (res) {
            if (res.data.result_code !== 0) {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000,
                mask: true
              })
              return;
            } else {
              if (JSON.parse(res.data.body).length > 0) {
                console.log(JSON.parse(res.data.body))
                that.setData({
                  sendInifList: JSON.parse(res.data.body),
                  isRecord: true
                });
                that.iconStatus();
              } else {
                that.setData({
                  isRecord: false
                });
              }
            }

          },
          fail: function () {
          }
        })
      },
      fail: function () {
        that.setData({
          isRecord: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**
   * 我要发货
   */
  linkGoods: function ()  {
    var loginUser = app.globalData.loginUser;
    if (loginUser == "" || loginUser == null) {
      util.isLogin();
    } else {
      wx.navigateTo({
        url: '../home/goods/goods'
      })
    }
  },
  /**
  * 我的订单
  */
  linkOrder: function () {
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
  * 地址管理
  */
  linkAddress: function () {
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
   * 扫一扫
   */
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        that.setData({
          oddNumbers: res.result
        })
        that.search();  // 查询
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  /**
   * 搜索查询
   */
  search: function () {
    var that = this;
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: "网络中断，请稍后再试",
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    var oddNumbers = that.data.oddNumbers;
    var params = new Object();
    params.planNO = oddNumbers;
    http.POST({
      url: "WeChatQueryOrderNoInfo",
      params: params,
      success: function (res) {
        if (res.data.result_code !== 0) {
          wx.showToast({
            title: "查询订单号码不存在",
            icon: 'none',
            duration: 2000,
            mask: true
          })
          return;
        } 
        console.log(JSON.parse(res.data.body));
        wx.navigateTo({
          url: 'order/track/track?array=' + res.data.body + '&status=' + JSON.parse(res.data.body).status
        })
      },
      fail: function () {
      }
    })
 
    that.setData({
      isSearch: true
    });
  },
  /**
   * 搜索框获得焦点
   */
  getfocus:function(){
    var that = this;
    that.setData({
      isSearch: false
    });
  },
  /**
   * 搜索框失去焦点
   */
  getblur: function () {
    var that = this;
    var oddNumbers = that.data.oddNumbers;
    if (oddNumbers == "") {
      that.setData({
        isSearch: true
      });
    }
  },
  /**
   * 获取单号
   */
  setOddNumbers:function(e){
    var that = this;
    that.setData({
      oddNumbers: e.detail.value
    });
  },
  /**
   * 删除输入数据
   */
  deleteInput:function(){
    var that = this;
    that.setData({
      oddNumbers: ""
    });
  },
  /**
   * 查询运单时间轴
   */
  homeViewDetails:function(e){
    var params = new Object();
    params.type = 1;
    params.planNO = e.currentTarget.dataset.planno;
    http.POST({
      url: "WeChatPPodDetailScanner",
      params: params,
      success: function (res) {
        if (res.data.result_code !== 0) {
          wx.showToast({
            title: '查询出错了',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          return;
        } 
        wx.navigateTo({
          url: '../home/order/track/track?array=' + res.data.body + '&status=' + e.currentTarget.dataset.status
        })
      },
      fail: function () {
      }
    })
  }
})