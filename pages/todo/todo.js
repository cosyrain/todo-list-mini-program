// pages/todo/todo.js
const app = getApp();

Page({
    data: {
        canIUseGetUserProfile: false,
        hasUserInfo: false,
        userInfo: {},
        status: '1',
        curList: [{
                id: 1,
                title: '测试',
                status: 1
            },
            {
                id: 2,
                title: '测试2',
                status: 0
            }
        ]
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
    },
    showStatus(e) {
        var st = e.currentTarget.dataset.status;
        if (this.data.status === st) return;
        this.setData({
            status: st,
        })
    }
})