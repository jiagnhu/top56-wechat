const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}// 加上时分秒  + ' ' + [hour, minute, second].map(formatNumber).join(':')

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 判断是否登陆
const isLogin = () => {
  var loginUser = app.globalData.loginUser;
  if (loginUser == "" || loginUser == null) {
    wx.showModal({
      title: '提示',
      content: '您未登陆，是否跳转到登陆页面',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../my/login/login'
          })
        } else {
          console.log('取消')
        }
      }
    });
  }
} 

module.exports = {
  formatTime: formatTime,
  isLogin: isLogin
}

