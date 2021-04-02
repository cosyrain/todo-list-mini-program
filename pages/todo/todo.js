// pages/todo/todo.js
const app = getApp();

Page({
    data: {
        canIUseGetUserProfile: false,
        hasUserInfo: false,
        userInfo: {}
    },
    onLoad() {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },
    getUserProfile(e) {
        wx.getUserProfile({
            desc: '完善会员资料',
            success: (res) => {
                app.globalData.userInfo = res.userInfo;
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    getUserinfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})