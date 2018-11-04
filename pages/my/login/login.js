const http = require('../../../utils/http.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codename:"获取验证码",
    user:"无",
    phone:"",
    code:"",
    spare:'',
    disabled: false,
    cont:'',
    buttonColor:"#C4C4C4",
    isdisabled: true,
    buttonColor2: "#FE7600",
    isdisabled2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self  = this;
    if (app.globalData.loginUser) {
      self.setData({
        user: app.globalData.loginUser
      });
    } else {
      self.setData({
        user:'无',
        buttonColor2: "#C4C4C4",
        isdisabled2: true
      });
    }
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
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
    this.LandChack();
  },
  getVerificationCode(e) {
    var _this = this
    _this.getCode();
  },
  /**
   * 获取验证码
   */
  getCode: function () {
    var _this = this;
    var myreg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (_this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return ;
    } else if (!myreg.test(_this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return ;
    } else {
      if (app.globalData.networkState == false) {  // 断网
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return;
      }
      if (_this.data.phone == _this.data.user) {
        wx.showToast({
          title: '该用户已绑定',
          icon: 'none',
          duration: 3000,
          mask: true
        })
        return;
      }

      _this.setData({
        cont: _this.random(),  // 验证码
        disabled: true
      })
      var num = 91;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          _this.setData({
            codename: '重新发送',
            disabled: false
          })

        } else {
          _this.setData({
            codename: num + "s 后重新获取",
          })
        }
      }, 1000)
      var params = new Object();
      params.account = "N554615_N7765400";
      params.password = "OE1dZQy2wNc426";
      params.phone = _this.data.phone;
      params.msg = "【至上物流】您的验证码是" + _this.data.cont;
      params.report = true;
      wx.request({
        url: 'https://smssh1.253.com/msg/send/json',
        data: params,
        header: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        success(res) {
          if (res.data.errorMsg == ""){
            wx.showToast({
              title: '短信发送成功',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            _this.setData({
              spare: _this.data.phone,
              spare2: params.phone,
            })
          } else {
            wx.showToast({
              title: '短信发送失败' + res.data.errorMsg,
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        },
        fail: function (erroe) {
          console.log(erroe);
        }
      })
    }
  },
  /**
   * 生成验证码
   */
  random:function () {
    var num = "";
    for(var i = 0; i < 6 ; i++){
      num = num + Math.floor(Math.random() * 10);
    }
    return num; 
  },
  /**
   * 输入验证码
   */
  InputValidation:function(e){
    var self = this;
    self.setData({
      code: e.detail.value
    });
    self.LandChack();
  },
  /**
   * 登陆校验
   */
  LandChack:function(){
    var self = this;
    if (self.data.phone !== "" && self.data.code !== "") {
      self.setData({
        buttonColor:'#FE7600',
        isdisabled:false
      });
    } else {
      self.setData({
        buttonColor: '#C4C4C4',
        isdisabled: true
      });
    }

  },
  /**
   * 解绑
   */
  untie:function(){
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    wx.setStorageSync('UserName', "");
    app.globalData.loginUser = null;
    this.onLoad();
    wx.showToast({
      title: '解绑成功',
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  /**
   * 绑定
   */
  land:function(e){
    var self= this;
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (self.data.code == ""){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (self.data.code !== self.data.cont) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (self.data.disabled == false) {
      wx.showToast({
        title: '验证码失效,请重新获取',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (self.data.spare !== self.data.phone) {
      wx.showToast({
        title: '验证码错误，请重新输入',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (self.data.spare2 !== self.data.phone) {
      wx.showToast({
        title: '验证码错误，请重新输入',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    
    // 保存到本地
    wx.setStorageSync('UserName', self.data.phone)
    app.globalData.loginUser = self.data.phone;   // 保存到本地
    wx.showToast({
      title: '绑定成功',
      icon: 'none',
      duration: 2000,
      mask: true
    })
    setTimeout(function () {
      wx.navigateBack(); // 返回上一个页面
    }, 2000)
  }
})