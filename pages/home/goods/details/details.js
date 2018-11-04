Page({
  /**
   * 页面的初始数据
   */
  data: {
    isother:true,
    otherValue:'',
    goodsDetails: {
      numberValue: 0,
      weightValue: 0,
      volumeVlaue: 0,
      goodsType: ""
    },
    styleLsit: [{
        isChecked: false
      },
      {
        isChecked: false
      },
      {
        isChecked: false
      },
      {
        isChecked: false
      },
      {
        isChecked: false
      },
      {
        isChecked: false
      },
    ],
    isdisabled: true,
    buttonColor:'#C4C4C4'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    if (options.data == "" || options.data == undefined) {
      return;
    }
    var goods = JSON.parse(options.data);
    var index = 0;
   
    if (goods.goodsType == "日用品") {
      index = 0;
    } else if (goods.goodsType == "文件") {
      index = 1;
    } else if (goods.goodsType == "数码产品") {
      index = 2;
    } else if (goods.goodsType == "服装") {
      index = 3;
    } else if (goods.goodsType == "食品") {
      index = 4;
    } else {
      index = 5;
      self.setData({
        isother:false,
        otherValue: goods.goodsType
      });
    }
    var isChecked = "styleLsit["+index+"].isChecked" ;
    self.setData({
      goodsDetails: goods,
      [isChecked]:true
    });

    self.required(); // 必填判断
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
   * 加
   */
  number_plus: function(e) {
    var self = this;
    var numberValued = 'goodsDetails.numberValue';
    var weightValued = 'goodsDetails.weightValue';
    var volumeVlaued = 'goodsDetails.volumeVlaue';
    switch (e.currentTarget.dataset.label) {
      case "件数":
        if (self.data.goodsDetails.numberValue == 999999) {
          return;
        } 
        
        var numberValue = self.data.goodsDetails.numberValue + 1;
        self.setData({
          [numberValued]: numberValue
        });
        self.required(); // 必填判断
        break;
      case "重量":
        if (self.data.goodsDetails.weightValue == 1000000) {
          return;
        } 
        var weightValue = self.data.goodsDetails.weightValue + '';
        if (weightValue.indexOf('.') > 0) {
          var array = weightValue.split('.');
          array[0] = parseInt(array[0]) + 1;
          weightValue = array[0] + '.' + array[1];
        } else {
          weightValue = parseInt(weightValue) + 1;
        }
        self.setData({
          [weightValued]: weightValue
        });
        //self.required(); // 必填判断
        break;
      case "体积":
        if (self.data.goodsDetails.volumeVlaue == 999999) {
          return;
        } 
        var volumeVlaue = self.data.goodsDetails.volumeVlaue+'';
        if (volumeVlaue.indexOf('.') > 0) {
          var array = volumeVlaue.split('.');
          array[0] = parseInt(array[0]) + 1;
          volumeVlaue = array[0] + '.' + array[1];
        } else {
          volumeVlaue = parseInt(volumeVlaue) + 1;
        }
        self.setData({
          [volumeVlaued]: volumeVlaue
        });
        //self.required(); // 必填判断
        break;
    }


  },
  /**
   * 减
   */
  number_reduce: function(e) {
    var self = this;
    var numberValued = 'goodsDetails.numberValue';
    var weightValued = 'goodsDetails.weightValue';
    var volumeVlaued = 'goodsDetails.volumeVlaue';
    switch (e.currentTarget.dataset.label) {
      case "件数":
        var numberValue = self.data.goodsDetails.numberValue - 1;
        if (numberValue < 0) {
          return;
        }
        self.setData({
          [numberValued]: numberValue
        });
        self.required(); // 必填判断
        break;
      case "重量":
        var weightValue = self.data.goodsDetails.weightValue +'';

        if (weightValue.indexOf('.') > 0) {
          var array = weightValue.split('.');
          if (array[0] > 0) {
            array[0] = parseInt(array[0]) - 1;
          }
          weightValue = array[0] + '.' + array[1];
        } else {
          weightValue = parseInt(weightValue) - 1;
        }
        if (weightValue < 0) {
          return;
        }
        self.setData({
          [weightValued]: weightValue
        });
        self.required(); // 必填判断
        break;
      case "体积":
        var volumeVlaue = self.data.goodsDetails.volumeVlaue + '';
        if (volumeVlaue.indexOf('.') > 0) {
          var array = volumeVlaue.split('.');
          if (array[0] > 0) {
            array[0] = parseInt(array[0]) - 1;
          }
          volumeVlaue = array[0] + '.' + array[1];
        } else {
          volumeVlaue = parseInt(volumeVlaue) - 1;
        }
        if (volumeVlaue < 0) {
          return;
        }
        self.setData({
          [volumeVlaued]: volumeVlaue
        });
        self.required(); // 必填判断
        break;
    }
  },
  /**
   * 手动输入
   */
  manualInput: function(e) {
    var self = this;
    var value = e.detail.value;
    var numberValued = 'goodsDetails.numberValue';
    var weightValued = 'goodsDetails.weightValue';
    var volumeVlaued = 'goodsDetails.volumeVlaue';
    switch (e.target.dataset.lable) {
      case "件数":
        value = self.numberControl2(value,2);
        self.setData({
          [numberValued]: value
        });
        self.required(); // 必填判断
        break;
      case "重量":
          value = self.numberControl2(value, 1);
          self.setData({
            [weightValued]: value
          });
        break;
      case "体积":
        value = self.numberControl2(value, 1);
        self.setData({
          [volumeVlaued]: value
        });
        
        break;
    }
  },
  /**
   * 数字输入控制
   */
  numberControl2: function (value,key) {
    if (value == "") { return value;}
    // 判断是否是0开头的两位数
    if(value.length == 2){
      if (value.indexOf('.') < 0) {
        if (value.substr(0, 1) == "0") {
          value = '';
        }
      }
    }
    
   // 保留两位小数
   if (key == 1) {
     if (value.indexOf('.') > 0) {
       var array = value.split('.');
       if (parseInt(array[0]) > 1000000){
         array[0] = array[0].slice(0, 6);
       }
       if (array[1].length >= 2) {
         array[1] = array[1].slice(0, 2);
         value = array[0] + '.' + array[1];
       }
     } else {
       if (value > 1000000) {
         value = value.slice(0, 6);
       }
     }
   } else {
     if (value > 1000000) {
       value = value.slice(0, 6);
     }
     value = parseInt(value);
   }
    return value;
  },
  /**
   * 货品名称                                 
   */
  selectType: function(e) {
    var self = this;
    self.setData({
      isother: true
    });
    var goodsTyped = 'goodsDetails.goodsType';
    var lable = e.currentTarget.dataset.label;
    var nowKey = '';
    if (lable == "日用品") {
      nowKey = 'styleLsit[0].isChecked';
    } else if (lable == "文件") {
      nowKey = 'styleLsit[1].isChecked';
    } else if (lable == "数码产品") {
      nowKey = 'styleLsit[2].isChecked';
    } else if (lable == "服装") {
      nowKey = 'styleLsit[3].isChecked';
    } else if (lable == "食品") {
      nowKey = 'styleLsit[4].isChecked';
    } else if (lable == "其他") {
      nowKey = 'styleLsit[5].isChecked';
      if (self.data.otherValue !== "") {
        lable = self.data.otherValue;
      }
      self.setData({
        isother: false
      });
    }
    var styleLsit = self.data.styleLsit;
    for (var h = 0; h < styleLsit.length; h++) {
      styleLsit[h].isChecked = false;
    }
    self.setData({
      styleLsit: styleLsit
    });
    self.setData({
      [goodsTyped]: lable,
      [nowKey]: true
    });
    self.required(); // 必填判断
  },
  /**
   * 其他
   */
  getotherValue:function(e){
    var self = this;
    self.setData({
      otherValue: e.detail.value
    });

    var goodsTyped = 'goodsDetails.goodsType';
    self.setData({
      [goodsTyped]: self.data.otherValue
    });

    self.required(); // 必填判断
  },
  /**
   * 必填判断
   */
  required: function () {
    var self = this;
    var numberValue = self.data.goodsDetails.numberValue;
    var goodsType = self.data.goodsDetails.goodsType;
    var otherValue = self.data.otherValue;
    var isdisabled = true;
    var buttonColor = '#C4C4C4';
   
     
    // 空格校验
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
     // 如果都是空格，则为空
    if (re.test(otherValue)) {
      otherValue = "";
      self.setData({
        otherValue: ''
      });
    }
    if (numberValue > 0 && re.test(goodsType) == false && re.test(otherValue) == false) {
      isdisabled = false;
      buttonColor = "#FE7600";
    }
    
    if (goodsType == "其他" || goodsType == "") {
      if (self.data.otherValue == "") {
        isdisabled = true;
        buttonColor = '#C4C4C4';
      }
    }

    
    self.setData({
      isdisabled: isdisabled,
      buttonColor: buttonColor
    });
  },
  /**
   * 确定
   */
  determine: function() {
    var self = this;
    var pages = getCurrentPages(); // 获取当前页面路由栈的信息
    var prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      goodsDetails: self.data.goodsDetails
    })
    wx.navigateBack(); // 返回上一个页面
  }
})