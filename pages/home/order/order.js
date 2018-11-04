const http = require('../../../utils/http.js')
const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: [{ label: "我发的", Number: 0 }, { label: "我收的", Number: 0 }],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    isRecord: true,
    isRecord2: true,
    sendInifList: [],
    coledInifList: []
  },
  onLoad: function (options) {
    var that = this;
    var params = {};
    var url = "WeChatMyReceipt";
    var _url = "WeChatMyDelivery";
    params.numberPhone = app.globalData.loginUser;
    that.getHttp(params, _url, "我寄的");
    that.getHttp(params, url, "我收的");
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    
  },
  tabClick: function(e) {
    var that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 请求网络
   */
  getHttp: function (params, url,_type){
    var self = this;
    http.POST({
      url: url,
      params: params,
      success: function (res) {
        var datasList = JSON.parse(res.data.body).datas;
        if (_type == "我收的") {
          var Number = "tabs[1].Number"
          if (datasList.length  > 0) {
            self.setData({
              sendInifList: datasList,
              [Number]: datasList.length,
              isRecord: false
            });
          } else {
            self.setData({
              isRecord: true
            });
          }
        } else if (_type == "我寄的") {
          var Number = "tabs[0].Number"
          if (datasList.length > 0 ) {
            self.setData({
              coledInifList: datasList,
              [Number]: datasList.length,
              isRecord2: false
            });
          } else {
            self.setData({
              isRecord2: true
            });
          }
        }
        self.showStatus();
      },
      fail: function (erro) {
      }
    })
  },
  /**
   * 显示状态
   */
  showStatus:function(){
    var that = this;
    // 根据状态显示图标
    var sendInifList = that.data.sendInifList;
    var coledInifList = that.data.coledInifList;
    for (var i = 0; i < sendInifList.length; i++) {
      if (sendInifList[i].status == "待揽件") {
        sendInifList[i].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_etc@2x.png";
      } else if (sendInifList[i].status == "运输中") {
        sendInifList[i].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_tran@2x.png";
      } else if (sendInifList[i].status == "已签收") {
        sendInifList[i].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_signed@2x.png";
      }
    }
    for (var k = 0; k < coledInifList.length; k++) {
      if (coledInifList[k].status == "待揽件") {
        coledInifList[k].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_etc@2x.png";
      } else if (coledInifList[k].status == "运输中") {
        coledInifList[k].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_tran@2x.png";
      } else if (coledInifList[k].status == "已签收") {
        coledInifList[k].stateImag = "http://118.31.54.90:8010/WinXinPic/ico_signed@2x.png";
      }
    }
    that.setData({
      sendInifList: sendInifList,
      coledInifList: coledInifList
    });
  },
  /**
   * 查看运单详情
   */
  viewDetails: function(e){
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: "网络中断，请稍后再试",
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    var params = new Object();
    params.type = 2;
    params.planNO = e.currentTarget.dataset.planno; 
    http.POST({
      url: "WeChatPPodDetailScanner",
      params: params,
      success: function (res) {
        console.log(JSON.parse(res.data.body));
        console.log(e.currentTarget.dataset.status);
        if (res.data.result_code !== 0) {
          wx.showToast({
            title: '查询出错了',
            icon: 'none',
            duration: 2000,
            mask:true
          })
          return;
        }
        wx.navigateTo({
          url: '../order/track/track?array=' + res.data.body + '&status=' + e.currentTarget.dataset.status
        })
      },
      fail: function () {
      }
    })
      
  },
  viewDetails2: function (e) {
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: "网络中断，请稍后再试",
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
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
          url: '../order/track/track?array=' + res.data.body + '&status=' + e.currentTarget.dataset.status
        })
      },
      fail: function () {
      }
    })
  },
});