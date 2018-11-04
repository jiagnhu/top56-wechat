
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    imgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var arrayer = options.array;
    self.setData({
      status: options.status,
      array: JSON.parse(arrayer).datas
    });
    self.state();
  },
  /**
   * 状态显示
   */
  state:function(){
    var self = this;
    var array = self.data.array;
    var imgUrl = "";
    // 条件判断状态显示什么图标
    if (self.data.status == "待揽件") {
      imgUrl = "http://118.31.54.90:8010/WinXinPic/dai@2x.png";
    } else if (self.data.status == "运输中") {
      imgUrl = "http://118.31.54.90:8010/WinXinPic/yun@2x.png";
    } else if (self.data.status == "已签收") {
      imgUrl = "http://118.31.54.90:8010/WinXinPic/ico_Sign in@2x.png";
    }
    
    for (var i = 0; i < array.length; i++) {
      // 条件判断时间轴显示什么图标
      if (array[i].scannerRecord.indexOf("已签收") > -1) {
        array[i].img = "http://118.31.54.90:8010/WinXinPic/gou@2x.png";
        array[i].size = "26rpx;";
        array[i].location = "-14rpx;";
      } else {
        array[i].img = "http://118.31.54.90:8010/WinXinPic/1760@2x.png";
        array[i].size = "10rpx;";
        array[i].location = "-5rpx;";
      }
      // 把最后一条隐藏掉。
      if (i == (array.length - 1)) {
        array[i].hidden = true;
      } else {
        array[i].hidden = false;
      }
    }
    self.setData({
      array: array,
      imgUrl: imgUrl
    })
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

  }
})