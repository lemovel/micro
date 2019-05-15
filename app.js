//app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //展示本地存储能力
    var logs = wx.getStorageSync('log')||[]
    logs.unshift(Date.now())
    wx.setStorageSync('logs',logs)
    //登录
    wx.login({
      success:res=>{
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // console.log(res,"res")
        this.http('v1/wx/getUser',{code:res.code}).then(res=>{
          const app = getApp()
          app.globalData.openid = res.data.openid
          app.globalData.userInfo = res.data
          if(!res.data.mobile) {
            wx.reLaunch({
              url: '/pages/bindPhone/index',
            })
          }
        })
      }
    })
    //获取用户信息
    wx.getSetting({
      success:res=>{
        if(res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success:res=>{
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if(this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  http:function(url,data="",method="GET"){//封装http请求
    const apiUrl = 'https://wx.yogalt.com/api/' //请求域名
    // console.log(this.globalData)
    const currency = {
      openid:this.globalData.openid
    }
    return new Promise((resolve,reject)=>{
      wx.request({
        url: apiUrl + url,
        data: Object.assign(currency,data),
        method:method,
        success:function(res){
          if(res.data.code!=200) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              success:function(res){
                if(res.confirm){
                  console.log("confirm")
                }
                else if (res.cancel) {
                  console.log("cancel")
                }
              }
            })
          }
        },
        fail:(res)=>{
          reject(res)
        },
        complete:()=>{
          //complete
        }


      })
    })

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  globalData:{
    userInfo:null,
    openid:null
  }
})
