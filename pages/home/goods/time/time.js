Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      }
    ],
    timeLsit: [{
        date: "现在发货",
        time: "",
        isselect: false
      },
      {
        date: "",
        time: "",
        isselect: false
      },
      {
        date: "",
        time: "",
        isselect: false
      },
      {
        date: "",
        time: "",
        isselect: false
      }
    ],
    selectTime: {},
    cataSelect: -1,
    isdisplay: "none",
    buttonColor: "#C4C4C4",
    isdisabled: true,
    disabled1:false,
    disabled2: false,
    disabled3: false,
    disabled4: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var date1 = 'timeLsit[1].date';
    var date2 = 'timeLsit[2].date';
    var date3 = 'timeLsit[3].date';
    var date;
    date = new Date();
    var h = date.getHours();
    if (h < 17) {
      self.setData({
        [date1]: self.getTime(0),
        [date2]: self.getTime(1),
        [date3]: self.getTime(2),
      });
    } else {
      self.setData({
        [date1]: self.getTime(1),
        [date2]: self.getTime(2),
        [date3]: self.getTime(3),
      });
    }

    if (options.data == "" || options.data == undefined) {
      return;
    }
    // 回显数据
    var time = JSON.parse(options.data);
    var timeLsitd = self.data.timeLsit;
    for (var k = 0; k < timeLsitd.length; k++){
      if (time.date == timeLsitd[k].date) {
        var timeL = "timeLsit["+k+"]";
        self.setData({
          [timeL]: time,
          cataSelect: k,
          isdisabled: false,
          buttonColor: "#FE7600"
        });
      }
    }
    if(time.date !== "现在发货") {
      self.setData({
        isdisplay:false
      });
      var ind = -1;
      if (time.time == "09:00-11:00") {
        ind = 0;
      } else if (time.time == "11:00-13:00") {
        ind = 1;
      } else if (time.time == "13:00-15:00") {
        ind = 2;
      } else if (time.time == "15:00-17:00") {
        ind = 3;
      }
      var isChecked = "styleLsit[" +ind+"].isChecked";
      self.setData({
        [isChecked]:true
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
   * 选择时间
   */
  selectTime: function(e) {
    var self = this;
    var lable = e.currentTarget.dataset.label;
    var index = self.data.cataSelect;
    var time = 'timeLsit[' + index + '].time';
    var nowKey = '';
    if (lable == "09:00-11:00") {
      nowKey = 'styleLsit[0].isChecked';
    } else if (lable == "11:00-13:00") {
      nowKey = 'styleLsit[1].isChecked';
    } else if (lable == "13:00-15:00") {
      nowKey = 'styleLsit[2].isChecked';
    } else if (lable == "15:00-17:00") {
      nowKey = 'styleLsit[3].isChecked';
    }
    var styleLsit = self.data.styleLsit;
    for (var h = 0; h < styleLsit.length; h++) {
      styleLsit[h].isChecked = false;
    }
    self.setData({
      styleLsit: styleLsit
    });
    self.setData({
      [nowKey]: true,
      [time]: lable,
      isdisabled: false,
      buttonColor: "#FE7600"
    });
  },
  /**
   * 选择日期
   */
  selectDate: function(e) {
    var self = this;
    var isdisplaye = "";
    var index = e.target.dataset.index;
    var Todate = self.data.timeLsit[index].date;
    var isselect2 = 'timeLsit[' + index + '].isselect';
    var time2 = 'timeLsit[' + index + '].time';
    var goodsTime = "";
    if (index > 0) {   // 如果不选择现在发货
      // 获取当前日期和时间
      var date;
      date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1; 
      var d = date.getDate();
      var h = date.getHours(); // 时
      if (m < 10) {
        m = '0' + m;
      };
      if (d < 10) {
        d = '0' + d;
      };
      if (h < 10) {
        h = '0' + m;
      };
      var Today = y + "-" + m + "-" + d;
      if (Today == Todate){   // 如果当前日期和我选择的日期一样，则判断当前的时间段
          if (h >= 11) {
            self.setData({
              disabled1:true
            })
          }
        if (h >= 13) {
          self.setData({
            disabled2: true
          })
        }
        if (h >= 15) {
          self.setData({
            disabled3: true
          })
        }
        if (h >= 17) {
          self.setData({
            disabled4: true
          })
        }
      } else {
        self.setData({
          disabled1: false,
          disabled2: false,
          disabled3: false,
          disabled4: false,
        })
      }
      isdisplaye = "block";
      self.setData({ // 禁用按钮，并变色
        isdisabled: true,
        buttonColor: "#C4C4C4"
      });
    } else {          // 如果选择现在发货
      isdisplaye = "none"; // 隐藏时间选择面板
      self.setData({ // 取消按钮禁用，并变色
        isdisabled: false,
        buttonColor: "#FE7600"
      });
      // 计算当前时间
      var date;
      date = new Date();
      var h = date.getHours();
      var m = date.getMinutes();
      var k = 11;
      if (h < 10) {
        k = h + 1;
        h = '0' + h;
      };
      if (m < 10) {
        m = '0' + m;
      };
      // 推迟1小时

      if (k <= 10) {
        if (k < 10) {
          k = '0' + k;
        }
        goodsTime = h + ":" + m + "-" + (k) + ":" + m;
      } else {
        goodsTime = h + ":" + m + "-" + (h + 1) + ":" + m;
      }
     

    }
    for (var h = 0; h < self.data.styleLsit.length; h++) { // 数据初始化
      var styleLsited = 'styleLsit[' + h + '].isChecked';
      var time = 'timeLsit[' + h + '].time';
      var isselect = 'timeLsit[' + h + '].isselect';
      self.setData({
        [styleLsited]: false,
        [time]: "",
        [isselect]: false
      });
    }
    self.setData({ // 重新赋值
      cataSelect: index,
      isdisplay: isdisplaye,
      [isselect2]: true,
      [time2]: goodsTime
    });
  },
  /**
   * 获取时间
   */
  getTime: function(addDayCount) {
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
   * 确定
   */
  determine: function() {
    var self = this;
    var pages = getCurrentPages(); // 获取当前页面路由栈的信息
    var prevPage = pages[pages.length - 2]; // 上一个页面
    var timeLsit = self.data.timeLsit;
    // 提取数据
    for (var f = 0; f < timeLsit.length; f++) {
      if (timeLsit[f].isselect == true) {
        self.setData({
          selectTime: timeLsit[f]
        });
      }
    }
    prevPage.setData({
      selectTime: self.data.selectTime
    })
    wx.navigateBack(); // 返回上一个页面
  }
})