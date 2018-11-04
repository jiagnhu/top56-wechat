const http = require('../../../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    incrementList: {
      price: "",
      isCollection: false,
      signReceipt: "无需返单",
      accountOpening: '',
      accountOpeningBank: '',
      bankAccount: '',
      IDnumber: '',
      CollectionGoods: '',
      householdPhone: ''
    },
    isdisabled: false,
    buttonColor: "#FE7600",
    array: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var params = {};
    params.kind = 8;
    http.POST({
      url: "BasicDownLoad",
      params: params,
      success: function(res) {
        self.setData({
          array: JSON.parse(res.data.body)
        });
      },
      fail: function(res) {}
    })
    if (options.data == "" || options.data == undefined) {
      return;
    }
    var incr = JSON.parse(options.data);
    
    self.setData({
      incrementList: incr
    });
    self.nonEmptyCheck();

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
   * 保价声明
   */
  price: function(e) {
    var self = this;
    var price = 'incrementList.price';
    // 小数校验
    var value = self.numberControl(e.detail.value);
    self.setData({
      [price]: value
    });
    self.nonEmptyCheck();
  },
  /**
   * 是否代收货款
   */
  switchChange: function(e) {
    var self = this;
    var Collection = 'incrementList.isCollection';
    var accountOpening = 'incrementList.accountOpening';
    var accountOpeningBank = 'incrementList.accountOpeningBank';
    var bankAccount = 'incrementList.bankAccount';
    var IDnumber = 'incrementList.IDnumber';
    var CollectionGoods = 'incrementList.CollectionGoods';
    var householdPhone = 'incrementList.householdPhone';

    self.setData({
      [Collection]: e.detail.value
    });
    if (e.detail.value == false) {
      self.setData({
        [accountOpening]:'',
        [accountOpeningBank]: '',
        [bankAccount]: '',
        [IDnumber]: '',
        [CollectionGoods]: '',
        [householdPhone]: ''
      });
    }
    self.nonEmptyCheck();
  },
  /**
   * 签收单
   */
  selectSingle: function(e) {
    var self = this;
    var index = e.detail.value;
    var label = self.data.array[index].fieldName; // 这个label就是选中项的label
    var signReceipt = 'incrementList.signReceipt';
    self.setData({
      index: index,
      [signReceipt]: label
    })
    self.nonEmptyCheck();
  },
  /**
   * 数字输入控制
   */
  numberControl: function(value) {
    if (value > 9999999) {
      value = value.slice(0, 7);
    }
    // 判断是否是0开头的两位数
    if (value.length == 2) {
      if (value.indexOf('.') < 0) {
        if (value.substr(0, 1) == "0") {
          value = '';
        } else {
          value = parseInt(value);
        }
      }
    }
    return value;
  },
  /**
   * 代收货款详细信息
   */
  sendName_B: function(e) {
    var self = this;
    if (e.currentTarget.dataset.leabl == "代收货款") {
      var CollectionGoods = 'incrementList.CollectionGoods';
      var value = self.numberControl(e.detail.value);
      self.setData({
        [CollectionGoods]: value
      });
    } else if (e.currentTarget.dataset.leabl == "开户人") {
      var accountOpening = 'incrementList.accountOpening';
      self.setData({
        [accountOpening]: e.detail.value
      });
    } else if (e.currentTarget.dataset.leabl == "开户银行") {
      var accountOpeningBank = 'incrementList.accountOpeningBank';
      self.setData({
        [accountOpeningBank]: e.detail.value
      });
    } else if (e.currentTarget.dataset.leabl == "银行账号") {
      var bankAccount = 'incrementList.bankAccount';
      self.setData({
        [bankAccount]: e.detail.value
      });
    } else if (e.currentTarget.dataset.leabl == "身份证号") {
      var IDnumber = 'incrementList.IDnumber';
      self.setData({
        [IDnumber]: e.detail.value
      });
    } else if (e.currentTarget.dataset.leabl == "开户人电话") {
      var householdPhone = 'incrementList.householdPhone';
      self.setData({
        [householdPhone]: e.detail.value
      });
    }
    self.nonEmptyCheck();
  },
  /**
   * 非空校验
   */
  nonEmptyCheck: function() {
    var self = this;
    var incrementList = self.data.incrementList;
    if (incrementList.isCollection == true) {
      var isdisabled = true;
      var buttonColor = "#C4C4C4";

      if (incrementList.accountOpening !== "" && incrementList.accountOpeningBank !== "" && incrementList.bankAccount !== "" &&
        incrementList.IDnumber !== "" && incrementList.CollectionGoods !== "" && incrementList.householdPhone !== "") {
        isdisabled = false;
        buttonColor = "#FE7600";
      }
    } else {
      isdisabled = false;
      buttonColor = "#FE7600";
    }
    self.setData({
      isdisabled: isdisabled,
      buttonColor: buttonColor
    });
  },
  /**
   * 银行卡号Luhn算法校验
   */
  luhnCheck: function (bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1));

    }
    var arrJiShu = new Array(); //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9

    var arrOuShu = new Array(); //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 == 1) { //奇数位
        if (parseInt(newArr[j]) * 2 < 9)
          arrJiShu.push(parseInt(newArr[j]) * 2);
        else
          arrJiShu2.push(parseInt(newArr[j]) * 2);

      } else //偶数位
        arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);

    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m]);

    }

    for (var n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n]);

    }

    for (var p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);

    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (lastNum == luhn) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 确定
   */
  determine: function() {
    var self = this;
    var pages = getCurrentPages(); // 获取当前页面路由栈的信息
    var prevPage = pages[pages.length - 2]; // 上一个页面
    /**
       *
    var myreg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/; // 手机号码验证
    var regName = /^[\u4e00-\u9fa5]{2,4}$/; // 姓名验证
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; // 身份证校验
    
    if (self.data.incrementList.isCollection == true) {
        if (!regName.test(self.data.incrementList.accountOpening)) {
        wx.showToast({
          title: '开户人姓名填写有误',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return;
      }
       
      if (!self.luhnCheck(self.data.incrementList.bankAccount)) {
        wx.showToast({
          title: '银行卡号填写有误',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return;
      }
      if (!regIdNo.test(self.data.incrementList.IDnumber)) {
        wx.showToast({
          title: '身份证号填写有误',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return;
      }
      if (!myreg.test(self.data.incrementList.householdPhone)) {
        wx.showToast({
          title: '手机号码填写有误',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return;
      }
      
    }
    */
    var price = "incrementList.price";
    if (self.data.incrementList.price == "" || isNaN(self.data.incrementList.price)) {
      self.setData({
        [price]:null
      })
    }
    console.log(self.data.incrementList)
    prevPage.setData({
      incrementLst: self.data.incrementList
    })
    wx.navigateBack(); // 返回上一个页面
  },
})