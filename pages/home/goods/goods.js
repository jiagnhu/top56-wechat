const http = require('../../../utils/http.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    isagree: false,
    isdisabled: true,
    buttonColor: '#C4C4C4',
    isSelfSelection: '否',
    goodsName: '必填',
    goodsNumber: '',
    incrementName: '选填',
    collection: '',
    serviceValue: '必填',
    paymentValue: '必填',
    catalogSelect: 1,
    catalogSelect2: 1,
    mydate: '',
    mytime: '',
    messageBoard: '',
    sendParams: {
      name: '请输入寄件人信息',
      phoneNumber: '',
      state: '',
      city: '',
      countySeat: '',
      detailedAddr: ''
    },
    collectParams: {
      name: '请输入收件人信息',
      phoneNumber: '',
      state: '',
      city: '',
      countySeat: '',
      detailedAddr: ''
    },
    serviceModeList: [],
    paymentModeList: [],
    selectTime: null,
    incrementLst: null,
    goodsDetails: null ,
    sdNumberPhone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    self.getdefaultAddress();
    self.data.sdNumberPhone = app.globalData.loginUser;
    self.setData({    // 是否同意了发货条款
      isagree: app.globalData.agreement
    })
    var _URL2 = "BasicDownLoad";
    var params2 = {};
    params2.kind = 1;
    self.requestData(params2, _URL2, "付款方式");
    var params3 = {};
    params3.kind = 2;
    self.requestData(params3, _URL2, "服务方式");
  },
  /**
   * 获取默认地址
   */
  getdefaultAddress:function(){
    var self = this;
    var _URL = "WeChatQueryAddre";
    var params = {};
    params.type = 0;
    params.userLogin = app.globalData.loginUser;
    params.name = "";
    self.requestData(params, _URL, "默认地址");
  },
  /**
   * 请求网络数据
   */
  requestData: function(params, _URL, _TYPE) {
    var self = this;
    if (_TYPE == "我要发货") {
      self.setData({
        isdisabled: true
      })
    }
    http.POST({
      url: _URL,
      params: params,
      success: function(res) {
        if (_TYPE == "默认地址") {
          var sendId = self.data.sendParams.id;  // 寄件地址id
          var sendPL = 0;
          var collId = self.data.collectParams.id;  // 收地址id
          var collPL = 0;
          var list = JSON.parse(res.data.body)
          for (var n = 0; n < list.length; n++) {
            if (list[n].isDefaultOK == true) { 
              sendPL = 1;
              self.setData({
                sendParams: list[n]
              });
            } 
          }
          // 判断是否还存在这个地址
          if (sendPL == 0) {
            self.setData({
              sendParams: {
                name: '请输入寄件人信息',
                phoneNumber: '',
                state: '',
                city: '',
                countySeat: '',
                detailedAddr: ''
              }
            });
          }
          if (collPL == 0) {
            self.setData({
              collectParams: {
                name: '请输入收件人信息',
                phoneNumber: '',
                state: '',
                city: '',
                countySeat: '',
                detailedAddr: ''
              }
            });
          }
        } else if (_TYPE == "付款方式") {
          self.setData({
            paymentModeList: JSON.parse(res.data.body)
          });
        } else if (_TYPE == "服务方式") {
          self.setData({
            serviceModeList: JSON.parse(res.data.body)
          });
        } else if (_TYPE == "我要发货") {
          if (res.data.result_code == 0) {
            wx.showModal({
              content: '订单提交成功',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  self.setData({
                    isdisabled: true,
                    buttonColor: '#C4C4C4',
                    isSelfSelection: '否',
                    goodsName: '必填',
                    goodsNumber: '',
                    incrementName: '选填',
                    collection: '',
                    serviceValue: '必填',
                    paymentValue: '必填',
                    catalogSelect: 1,
                    catalogSelect2: 1,
                    selectTime: null,
                    incrementLst: null,
                    goodsDetails: null,
                    messageBoard: '',
                    mydate: '',
                    mytime: '',
                    collectParams: {
                      name: '请输入收件人信息',
                      phoneNumber: '',
                      state: '',
                      city: '',
                      countySeat: '',
                      detailedAddr: ''
                    }
                  });
                  self.getdefaultAddress();  // 获取地址信息
                }
              }
            });
          } else {
            wx.showModal({
              content: '网络异常，订单信息无法提交，请稍后再试',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  self.setData({
                    isdisabled: false
                  })
                }
              }
            });
          }
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var self = this;
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var self = this;
    self.nonEmptyCheck(); // 必填校验
    if (self.data.goodsDetails !== undefined && self.data.goodsDetails !== null) {
      self.setData({
        goodsName: self.data.goodsDetails.goodsType,
        goodsNumber: self.data.goodsDetails.numberValue + "件"
      });
    }

    if (self.data.selectTime !== undefined && self.data.selectTime !== null) {
      self.setData({
        mydate: self.data.selectTime.date,
        mytime: self.data.selectTime.time
      });
    }
    if (self.data.incrementLst !== undefined && self.data.incrementLst !== null) {
      if (self.data.incrementLst.isCollection == true) {
        self.setData({
          collection: '已代收',
        });
      } else{
        self.setData({
          collection: '',
        });
      }
      if (isNaN(self.data.incrementLst.price) == false && self.data.incrementLst.price !== null &&
       self.data.incrementLst.price !== '0') {
        self.setData({
          incrementName: '已保价',
        });
      } else {
        self.setData({
          incrementName: '未保价',
        });
      }

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 服务方式下拉框
   */
  selectService: function(e) {
    var self = this;
    var index = e.detail.value;
    var label = self.data.serviceModeList[index].fieldName;
    self.setData({
      serviceValue: label
    });
    self.nonEmptyCheck();
  },
  /**
   * 付款方式下拉框
   */
  selectPayment: function(e) {
    var self = this;
    var index = e.detail.value;
    var label = self.data.paymentModeList[index].fieldName;
    self.setData({
      paymentValue: label
    });
    self.nonEmptyCheck();
  },
  /**
   * 选择地址信息
   */
  selectAddress: function(e) {
    var self = this;
    var judge = e.currentTarget.id;
    var entrance = "";
    if (judge == "send") {
      entrance = "寄件人地址";
    } else {
      entrance = "收件人地址";
    }
    wx.navigateTo({
      url: '../address/address?entrance=' + entrance,
    })
  },
  /**
   * 货物信息
   */
  details: function() {
    var self = this;
    var goods = "";
    if (self.data.goodsDetails !== undefined && self.data.goodsDetails !== null) {
      goods = JSON.stringify(self.data.goodsDetails)
    }
    wx.navigateTo({
      url: '../goods/details/details?data=' + goods
    })
  },
  /**
   * 增值服务
   */
  increment: function() {
    var self = this;
    var incr = '';
    if (self.data.incrementLst !== undefined && self.data.incrementLst !== null) {
      incr = JSON.stringify(self.data.incrementLst)
    }
    wx.navigateTo({
      url: '../goods/increment/increment?data=' + incr
    })
  },
  /**
   * 预约发货时间
   */
  goodsDate: function() {
    var self = this;
    var time = '';
    if (self.data.selectTime !== undefined && self.data.selectTime !== null) {
      time = JSON.stringify(self.data.selectTime)
    }
    wx.navigateTo({
      url: '../goods/time/time?data=' + time
    })
  },
  /**
   * 必填校验
   */
  nonEmptyCheck: function() {
    var self = this;
    console.log(self.data.isagree);
    if (self.data.goodsDetails == undefined || self.data.sendParams.phoneNumber == "" ||
      self.data.collectParams.phoneNumber == "" || self.data.serviceValue == "必填" ||
      self.data.paymentValue == "必填" || self.data.selectTime == undefined || self.data.isagree == false) {
      self.setData({
        isdisabled: true,
        buttonColor: '#C4C4C4',
      });
    } else {
      self.setData({
        isdisabled: false,
        buttonColor: '#FE7600',
      });
    }

  },
  /**
   * 获取日期
   */
  getTimed: function(addDayCount) {
    var dd;
    dd = new Date();
    dd.setDate(dd.getDate() + addDayCount); //获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期 
    var d = dd.getDate();
    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    };
    return y + "-" + m + "-" + d;
  },
  /**
   * 同意勾选
   */
  agree: function(e) {
    var self = this;
    if (e.detail.value[0] == "同意") {
      self.setData({
        isagree: true
      });
    } else {
      self.setData({
        isagree: false
      });
    }
    self.nonEmptyCheck();
  },
  
  /**
   * 发货条款
   */
  deliveryTerms:function(){
    var self = this;
    self.setData({
      showModal: true
    })
  },
  /**
   * 关闭弹窗
   */
  modalColse:function(){
    var self = this;
    self.setData({
      showModal: false
    })
  },
  agreement: function () {
    var self = this;
    // 存储状态
    wx.setStorageSync('agreement', true);  
    // 获取状态
    wx.getStorage({
      key: 'agreement',
      success: function (res) {
        app.globalData.agreement = res.data
      }
    })
    // 赋值状态
    self.setData({
      showModal: false,
      isagree: app.globalData.agreement
    })

    self.nonEmptyCheck();
  },
  /**
   * 确认提交
   */
  formSubmit: function(e) {
    var self = this;
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: "网络中断，请稍后再试",
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (self.data.sdNumberPhone == "") {
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
          }
        }
      });
      return;
    }
    var params = {};
    params.sdName = self.data.sendParams.name; //String	30		寄件人
    params.sdTel = self.data.sendParams.phoneNumber; //String	30		寄件手机号码
    params.sdDetailedAddr = self.data.sendParams.detailedAddr; //String	90		寄件详细地址
    params.sdState = self.data.sendParams.state; //String	10		寄件省
    params.sdCity = self.data.sendParams.city; //String	10		寄件市
    params.sdCountySeat = self.data.sendParams.countySeat; //String	30		寄件区
    params.sdNumberPhone = self.data.sdNumberPhone;     // 寄件人用户名
    params.reConsinee = self.data.collectParams.name; //String	30		收件人
    params.reTel = self.data.collectParams.phoneNumber; //String	30		收件手机号码
    params.reDetailedAddr = self.data.collectParams.detailedAddr; //String	90		收件详细地址
    params.reState = self.data.collectParams.state; //String	10		收件省
    params.reCity = self.data.collectParams.city; //String	10		收件市
    params.reCountySeat = self.data.collectParams.countySeat; //String	30		收件区
    params.reNumberPhone = self.data.collectParams.phoneNumber; //String	30		收件人用户名
    params.descrName = self.data.goodsDetails.goodsType; //String	20		货物名称
    params.pcs = self.data.goodsDetails.numberValue; //int			件数
    params.actual = self.data.goodsDetails.weightValue; //BigDecimal			重量
    params.volCBM = self.data.goodsDetails.volumeVlaue; //BigDecimal			体积
    if (self.data.incrementLst !== undefined && self.data.incrementLst !== null) {
      params.insValue = self.data.incrementLst.price; //BigDecimal			声明价值
      params.isReceivables = self.data.incrementLst.isCollection; //Boolean			是否代收款
      params.signback = self.data.incrementLst.signReceipt; //string			签收单
      if (self.data.incrementLst.isCollection == true) { // 如果是否代收等于true
        params.codCharge = self.data.incrementLst.CollectionGoods; // BigDecimal 代收款金额
        params.sdbankName = self.data.incrementLst.accountOpeningBank; //String	50		开户银行
        params.sdbankAccountNO = self.data.incrementLst.bankAccount; //String	50		银行账号
        params.sdbankMan = self.data.incrementLst.accountOpening; //	String	30		开户人
        params.sdIdCard = self.data.incrementLst.IDnumber; //String	30		身份证号
        params.sdbankManTel = self.data.incrementLst.householdPhone; //String	30		开户人电话
      } else {
        params.codCharge = 0; // BigDecimal 代收款金额
        params.sdbankName = ""; //String	50		开户银行
        params.sdbankAccountNO = ""; //String	50		银行账号
        params.sdbankMan = ""; //	String	30		开户人
        params.sdIdCard = ""; //String	30		身份证号
        params.sdbankManTel = ""; //String	30		开户人电话
      }
    } else {
      params.insValue = 0; //BigDecimal			声明价值
      params.isReceivables = false; //Boolean			是否代收款
      params.signback = ""; //string			是否签收单
      params.codCharge = 0; // BigDecimal 代收款金额
      params.sdbankName = ""; //String	50		开户银行
      params.sdbankAccountNO = ""; //String	50		银行账号
      params.sdbankMan = ""; //	String	30		开户人
      params.sdIdCard = ""; //String	30		身份证号
      params.sdbankManTel = ""; //String	30		开户人电话
    }
    params.serviceType = self.data.serviceValue; //String	8		服务方式
    params.ccPayMent = self.data.paymentValue; //String	10		付款方式
    if (self.data.selectTime.date == "现在发货") {
      params.appointmentDate = self.getTimed(0); //Date			预约发货日期
    } else {
      params.appointmentDate = self.data.selectTime.date; //Date			预约发货日期
    }

    params.appointmentInterval = self.data.selectTime.time; //tring	30		预付发货时间区间
    params.textContent = e.detail.value.messageBoard; //String	300		发货正文内容
    var _URL = "WeChatOrderUpload";
    self.requestData(params, _URL, "我要发货");
  }

})