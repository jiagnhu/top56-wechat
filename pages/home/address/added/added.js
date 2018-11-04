const app = getApp()
const http = require('../../../../utils/http.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backObj:{
      s:'',ss:'',sN:'',ssN:'',qN:'',q:''
    },
    monitorSSQ:'等待你的到来',
    stateLanguage: "网络中断，请稍后再试！",
    isdisabled: false,
    operation:'',
    z_index: "none",
    value: "",
    checked: false,
    select_provinced: {
      label: '请选择',
      kind: 1,
      number: ''
    },
    select_city: {
      label: '',
      kind: 2,
      number: ''
    },
    select_area: {
      label: '',
      kind: 2,
      number: ''
    },
    information: { sendName: '', sendTel: '', ssq: '', sendAddess:''},
    province: [],
    city: [],
    area: [],
    buttonColor:"#C4C4C4",
    ishidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    // 获取省信息
    switch (options.operation) {
      case "新增":
        self.setData({
          type: 0,
          operation: '新增'
        });
        break;
      case "编辑":
        // 更改头部标题
        wx.setNavigationBarTitle({
          title: "编辑地址"
        })
        self.setData({
          information3: JSON.parse(options.information)
        });

         // 字段转换
        var information2 = new Object();
        information2.sendName = self.data.information3.name;
        information2.sendTel = self.data.information3.phoneNumber;
        information2.ssq = self.data.information3.state + self.data.information3.city + self.data.information3.countySeat;
        information2.sendAddess = self.data.information3.detailedAddr;
        information2.id = self.data.information3.id;
        information2.isDefaultOK = self.data.information3.isDefaultOK;

        // 省市区修改回显
        var provincedName = 'select_provinced.label';
        var cityName = 'select_city.label';
        var areaName = 'select_area.label';
        var provincedNumber = 'select_provinced.number';
        var cityNumber = 'select_city.number';

        var s = 'backObj.s';
        var ss = 'backObj.ss';
        var sN = 'backObj.sN';
        var ssN = 'backObj.ssN';
        var qN = 'backObj.qN';
        var q = 'backObj.q';

        self.setData({
          type: 2,
          operation: '编辑',
          information: information2,
          monitorSSQ: information2.ssq,
          buttonColor: "#C4C4C4",
          [provincedName]: self.data.information3.state,
          [cityName]: self.data.information3.city,
          [areaName]: self.data.information3.countySeat,
          [provincedNumber]: self.data.information3.stateCode,
          [cityNumber]: self.data.information3.cityCode,
          [sN]: self.data.information3.state,
          [ssN]: self.data.information3.city,
          [qN]: self.data.information3.countySeat,
          [s]: self.data.information3.stateCode,
          [ss]: self.data.information3.cityCode
        });
        break;
      default: //  n 与 case 1 和 case 2 不同时执行的代码
    }
  },
  
  /**
   * 获取省市区
   */
  getssq: function(kind, num) {
    var self = this;
    var params = new Object()
    params.kind = kind;
    params.number = num
    http.POST({
      url: "QueryRegionalArea",
      params: params,
      success: function(res) {
        self.setData({
          province: JSON.parse(res.data.body)
        });
      },
      fail: function() {}
    })
  },

  sendName_A:function(e){
    var self = this;
    var leabl = e.currentTarget.dataset.leabl;
    var sendName = 'information.sendName';
    var sendTel = 'information.sendTel';
    var ssq = 'information.ssq';
    var sendAddess = 'information.sendAddess';
    if (leabl == "sendName"){
      self.setData({
        [sendName]: e.detail.value
      });
    } else if (leabl == "sendTel"){
      self.setData({
        [sendTel]: e.detail.value
      });
    } else if (leabl == "sendAddess") {
      self.setData({
        [sendAddess]: e.detail.value
      });
    }
    var information = self.data.information;
    self.nonEmpty(information);
  },
  /**
   * 非空校验
   */
  nonEmpty: function (information){
    var self = this;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (information.sendName == "" || information.sendTel == "" || information.ssq == "" || information.sendAddess == "" ||
      re.test(information.sendName) == true || re.test(information.sendTel) == true || re.test(information.ssq) == true ||
      re.test(information.sendAddess) == true) {
      self.setData({
        buttonColor: "#C4C4C4"
      });
    } else {
      self.setData({
        buttonColor: "#FE7600"
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
   * 选择省市区
   */
  select: function(e) {
    var self = this;
    var numbered1 = self.data.select_provinced.number;
    var numbered2 = self.data.select_city.number;
    var numbered3 = self.data.select_area.number;

    var label1 = 'select_provinced.label';
    var numberd1 = 'select_provinced.number';

    var label2 = 'select_city.label';
    var numberd2 = 'select_city.number';

    var label3 = 'select_area.label';
    var numberd3 = 'select_area.number';

    var s = 'backObj.s'; 
    var ss = 'backObj.ss';
    var sN = 'backObj.sN';
    var ssN = 'backObj.ssN';
    var qN = 'backObj.qN';
    var q = 'backObj.q';
    if (numbered1 == "") {
      self.getssq(2, e.currentTarget.dataset.number);
      self.setData({
        [label1]: e.currentTarget.dataset.label,
        [numberd1]: e.currentTarget.dataset.number,
      });
    } else if (numbered2 == "") {
      self.getssq(3, e.currentTarget.dataset.number);
      self.setData({
        [label2]: e.currentTarget.dataset.label,
        [numberd2]: e.currentTarget.dataset.number,
        
      });
    } else {
      var ssq = "information.ssq";
      self.setData({
        [sN]: self.data.select_provinced.label,
        [s]: self.data.select_provinced.number,
        [ssN]: self.data.select_city.label,
        [ss]: self.data.select_city.number,
        [qN]: e.currentTarget.dataset.label,
        [q]: e.currentTarget.dataset.number,
        [label3]: e.currentTarget.dataset.label,
        [numberd3]: e.currentTarget.dataset.number,
        [ssq]: self.data.select_provinced.label + self.data.select_city.label + e.currentTarget.dataset.label,
        monitorSSQ: self.data.select_provinced.label + self.data.select_city.label + e.currentTarget.dataset.label,
        z_index: "none",
        ishidden: false
      });


      var information = self.data.information;
      self.nonEmpty(information);
    }
  },
  /**
   * 省，点击进入选择省
   */
  select_province: function(e) {
    var self = this;
    self.getssq(1, '');
    var label1 = 'select_provinced.label';
    var numberd1 = 'select_provinced.number';
    var label2 = 'select_city.label';
    var numberd2 = 'select_city.number';
    var label3 = 'select_area.label';
    var numberd3 = 'select_area.number';
    self.setData({
      [label1]: '请选择',
      [numberd1]: '',
      [label2]: '',
      [numberd2]: '',
      [label3]: '',
      [numberd3]: ''
    });
  },
  /**
   * 市
   */
  select_city: function(e) {
    var self = this;
    // 查询市
    self.getssq(2, e.currentTarget.dataset.number);
    // 清空市区
    var label2 = 'select_city.label';
    var numberd2 = 'select_city.number';
    var label3 = 'select_area.label';
    var numberd3 = 'select_area.number';
    self.setData({
      [label2]: '',
      [numberd2]: '',
      [label3]: '',
      [numberd3]: ''
    });
  },

  select_cityr: function(e) {
    var self = this;
    self.getssq(3, e.currentTarget.dataset.numberd);
    var label1 = 'select_provinced.label';
    var numberd1 = 'select_provinced.number';
    var label2 = 'select_city.label';
    var numberd2 = 'select_city.number';
    var label3 = 'select_area.label';
    var numberd3 = 'select_area.number';
    self.setData({
      [label1]: e.currentTarget.dataset.superior,
      [numberd1]: e.currentTarget.dataset.number,
      [label2]: e.currentTarget.dataset.label,
      [numberd2]: e.currentTarget.dataset.numberd,
      [label3]: '',
      [numberd3]: ''
    });
  },
  /**
   * 区
   */
  select_area: function(e) {
    var self = this;
  },
  /**
   * 关闭省市区选择层
   */
  close: function(e) {
    var self = this;
    self.setData({
      z_index: "none",
      ishidden: false
    });
  },
  /**
   * 点击所在地区
   */
  select_SSQ: function(e) {
    var self = this;
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: self.data.stateLanguage,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    } 
    self.setData({
      z_index: "block",
      ishidden: true
    });
    console.log(self.data.information.ssq)
    console.log(self.data.monitorSSQ)
    if (self.data.information.ssq == self.data.monitorSSQ) {
      var provincedName = 'select_provinced.label';
      var cityName = 'select_city.label';
      var areaName = 'select_area.label';
      var provincedNumber = 'select_provinced.number';
      var cityNumber = 'select_city.number';
      self.setData({
        [provincedName]: self.data.backObj.sN,
        [cityName]: self.data.backObj.ssN,
        [areaName]: self.data.backObj.qN,
        [provincedNumber]: self.data.backObj.s,
        [cityNumber]: self.data.backObj.ss,
      });
      self.getssq(3, self.data.backObj.ss);
    } else {
      self.getssq(1, '');
    }
    /**
     * if (self.data.operation == "编辑") {
      console.log(self.data.monitorSSQ)
      console.log(self.data.backObj)


    } else {
      console.log(self.data.select_city.number);
      // 如果没有选择省市区，就调用省市区接口
      if (self.data.select_city.number == "") {
        self.getssq(1, '');
      } else {

      }
    }
     */
    
  },
  /**
   * 保存
   */
  preservation: function(e) {
    var self = this;
    if (self.data.buttonColor == "#C4C4C4") {
      return;
    }
    var myreg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (!myreg.test(e.detail.value.sendTel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000,
        mask:true
      })
      return;
    }
    // 参数设置
    var params = new Object();
    
    params.type = self.data.type; // 类型
    if (self.data.operation == "编辑") {
      params.id = self.data.information.id; // id
      if (self.data.information.isDefaultOK == true) {
        params.isDefaultOK = 1; // 是默认
      } else {
        params.isDefaultOK = 0; // 否默认  
      }
    } if (self.data.operation == "新增") {
      params.id = ''; // id
      params.isDefaultOK = 0; // 是否默认
    }
    params.userLogin = app.globalData.loginUser;  // 用户名
    params.name = e.detail.value.sendName; // 姓名
    params.phoneNumber = e.detail.value.sendTel; // 手机号码
    params.state = self.data.select_provinced.label; // 省
    params.city = self.data.select_city.label; // 市
    params.countySeat = self.data.select_area.label; // 区
    params.detailedAddr = e.detail.value.sendAddess; // 详细地址
    if (app.globalData.networkState == false) {  // 断网
      wx.showToast({
        title: self.data.stateLanguage,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    http.POST({
      url: "WeChatAddreManagement",
      params: params,
      success: function(res) {
        self.setData({
          isdisabled : true
        });
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        // 返回上一个页面
        setTimeout(function () {
          wx.navigateBack(); // 返回上一个页面
        }, 2000)
      },
      fail: function(res) {
        console.log(res)
        //失败后的逻辑  
      }
    })
  },
})