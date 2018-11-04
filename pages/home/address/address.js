const app = getApp()
const http = require('../../../utils/http.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    entrance:'',
    radioValue: 1,
    pamas: {},
    information: [],
    numberPhone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      entrance: options.entrance
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 地址查询
   */
  addressQuery: function (typed,name) {
    var self = this;
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: "网络异常,请稍后再试",
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    } 
    var params = new Object();
    params.type = typed;
    params.userLogin = self.data.numberPhone;
    params.name = name;
    http.POST({
      url: 'WeChatQueryAddre',
      params: params,
      success: function (res) {
        //拿到返回后的数据，进行代码逻辑  
        self.setData({
          information: JSON.parse(res.data.body)
        });
      },
      fail: function (res) {
        //失败后的逻辑  
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.setData({
      numberPhone: app.globalData.loginUser
    });
    self.addressQuery(0, "");  // 查询
   
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
    var self = this;
    wx.showToast({
      title: '刷新',
      icon: 'loading',
      duration: 1000,
      mask:true
    });
    self.addressQuery(0, "");
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
   * 设置默认地址
   */
  radioChange: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var isDefaultOK = "information[" + index + "].isDefaultOK";
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: "网络异常,请稍后再试",
        icon: 'none',
        duration: 2000,
        mask: true
      })
      self.setData({
        [isDefaultOK]: false
      });
      return;
    } 
    var params = new Object();
    params.type = 3;
    params.id = e.currentTarget.dataset.id;
    params.userLogin = self.data.numberPhone;
    params.isDefaultOK = 1;
    http.POST({
      url: 'WeChatAddreManagement',
      params: params,
      success: function (res) {
        self.addressQuery(0, "");
        wx.showToast({
          title: '设置默认成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });
        //拿到返回后的数据，进行代码逻辑  
      },
      fail: function (res) {
        wx.showToast({
          title: '设置默认失败',
          icon: 'loading',
          duration: 1000,
          mask: true
        });
        self.setData({
          [isDefaultOK]: false
        });
        //失败后的逻辑  
      }
    })
  },
  /**
   * 搜索
   */
  nameQuery:function(e){
    var self = this;
    self.setData({
      queryName:e.detail.value
    });
    if (e.detail.value == "" && e.detail.value.length == 0) {
      self.addressQuery(0, "");
    }
  },
  search: function (e) {
    var self = this;
    if (self.data.queryName == "" || self.data.queryName == undefined) {
      self.addressQuery(0, "");
    } else {
      self.addressQuery(1, self.data.queryName);
    }
  },
  /**
   * 选择地址
   */
  selseAddes: function (e) {
    var self = this;
    var information = self.data.information; // 获得数组
    var index = e.currentTarget.dataset.index; // 获得数组下标
    var entrance = self.data.entrance;          // 获得入口
    var pages = getCurrentPages(); // 获取当前页面路由栈的信息
    var prevPage = pages[pages.length - 2];   // 上一个页面
    switch (entrance) {
      case "首页":
        break;
      case "寄件人地址":
        prevPage.setData({
          sendParams: information[index],
          isSelfSelection:'是'
        })
        wx.navigateBack();   // 返回上一个页面
        
        break;
      case "收件人地址":
        prevPage.setData({
          collectParams: information[index]
        })
        wx.navigateBack();   // 返回上一个页面
       
        break;
      default:    //  n 与 case 1 和 case 2 不同时执行的代码
    }
  },
  /**
   * 新增地址
   */
  addAddress: function () {
    var self = this;
    var operation = "新增";
    if (self.data.numberPhone == "") {
      wx.showModal({
        title: '提示',
        content: '请先登陆小程序',
        confirmText: "确定",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../my/login/login'
            })
          } else {
            console.log('取消')
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '../address/added/added?operation=' + operation
      })
    }
    
  },
  /**
   * 删除
   */
  deleted:function(e){
    var self = this;
    var params = new Object();
    params.type = 1;
    params.id = e.currentTarget.dataset.id;
    params.userLogin = self.data.numberPhone;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个常用地址吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          if (app.globalData.networkState == false) {  // 断网
            wx.showToast({
              title: "网络异常,请稍后再试",
              icon: 'none',
              duration: 2000,
              mask: true
            })
            return;
          } 
          http.POST({
            url: 'WeChatAddreManagement',
            params: params,
            success: function (res) {
              self.addressQuery(0, "");
              if (res.data.result_code == 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                });
              } else {
                wx.showToast({
                  title: '发送一个意料之外的错误',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                });
              }
              
              //拿到返回后的数据，进行代码逻辑  
            },
            fail: function (res) {
              //失败后的逻辑  
            }
          })
        } else {
          console.log('取消')
        }
      }
    });
    
  },
  /**
   * 编辑
   */
  edit: function (e) {
    var self = this;
    var operation = "编辑";
    var index = e.target.dataset.index;
    var information = self.data.information;
    var information2 = JSON.stringify(information[index]); 
    wx.navigateTo({
      url: '../address/added/added?information=' + information2 + '&operation='+ operation
    })
  }

})