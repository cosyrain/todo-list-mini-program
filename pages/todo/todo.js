// pages/todo/todo.js
const app = getApp();

Page({
    data: {
        canIUseGetUserProfile: false, // 是否能获取到用户信息
        hasUserInfo: false, // 是否已经有用户信息
        userInfo: {}, // 用户信息
        addForm: false, // 是否显示添加框
        addText: '', // 添加框输入的文字
        focus: false, // 添加框是否 focus
        status: '1', // 目前显示的类别，全部、未完成、已完成
        startX: 0, // 开始的触摸点x位置
        delBtnWidth: 120, //删除按钮宽度
        // 存放所有的事项
        list: [],
        // 存放当前类别事项
        curList: []
    },
    onLoad() {
        var _this = this;

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }

        wx.getStorage({
            key: 'list',
            success: (res) => {
                _this.setData({
                    list: res.data || [],
                    curList: res.data || []
                })
            }
        })
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
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    showStatus(e) {
        var st = e.currentTarget.dataset.status;
        if (this.data.status === st) return;
        if (st === '1') {
            this.setData({
                status: st,
                curList: this.data.list
            })
        } else {
            this.setData({
                status: st,
                curList: this.data.list.filter(item => item.status === (st - 2))
            })
        }
    },
    // 显示添加框
    showAddForm() {
        this.setData({
            addForm: true,
            focus: true,
            addText: ''
        })
    },
    // 隐藏添加框
    hideAddForm() {
        this.setData({
            addForm: false,
            addText: '',
            focus: false
        })
    },
    setInput(e) {
        this.setData({
            addText: e.detail.value
        })
    },
    addTodo() {
        if (!this.data.addText.trim()) return;
        var tempList = this.data.list;
        var addT = {
            id: new Date().getTime(),
            title: this.data.addText,
            status: 0
        }
        tempList.push(addT);
        this.setCurrent(tempList);
        this.hideAddForm();
        wx.setStorage({
            key: 'list',
            data: tempList
        });
        wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1000
        })
    },
    setCurrent(data) {
        if (this.data.status === '1') {
            this.setData({
                list: data,
                curList: data
            })
        } else {
            this.setData({
                list: data,
                curList: data.filter(item => item.status === (this.data.status - 2))
            })
        }
    },
    // 修改 TODO 事项是否完成
    changeTodo(e) {
        console.log(1);
        var _this = this;
        var item = e.currentTarget.dataset.id;
        var tempList = _this.data.list;

        tempList.forEach(el => {
            if (el.id === item) {
                if (el.status === 0) {
                    el.status = 1;
                    _this.setCurrent(tempList);
                    wx.setStorage({
                        key: 'list',
                        data: tempList
                    })
                    wx.showToast({
                        title: '已完成任务',
                        icon: 'success',
                        duration: 1000
                    })
                } else {
                    wx.showModal({
                        title: '',
                        content: '该任务已完成，确定重新开始任务？',
                        confirmText: '确认',
                        cancelText: '关闭',
                        success: (res) => {
                            if (res.confirm) {
                                el.status = 0;
                                _this.setCurrent(tempList);
                                wx.setStorage({
                                    key: 'list',
                                    data: tempList
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    touchS(e) {
        if (e.touches.length === 1) {
            this.setData({
                startX: e.touches[0].clientX
            })
        }
    },
    touchM(e) {
        var _this = this;
        if (e.touches.length === 1) {
            var moveX = e.touches[0].clientX;
            var disX = _this.data.startX - moveX;
            var delBtnWidth = _this.data.delBtnWidth;
            var style = '';
            if (disX <= 0) {
                style = 'right:0;'
            } else {
                style = `right:${disX}rpx`;
                if (disX >= delBtnWidth) {
                    style = `right:${delBtnWidth}rpx`;
                }
            }

            var index = e.currentTarget.dataset.index;
            var curList = _this.data.curList;
            curList[index].style = style;
            this.setData({
                curList: curList
            })
        }
    },
    touchE(e) {
        var _this = this;
        if (e.changedTouches.length === 1) {
            var endX = e.changedTouches[0].clientX;
            var disX = _this.data.startX - endX;
            var delBtnWidth = _this.data.delBtnWidth;
            var style = disX >= delBtnWidth / 2 ? `right:${delBtnWidth}rpx` : `right:0`;
            var index = e.currentTarget.dataset.index;
            var curList = _this.data.curList;

            curList.forEach(el => {
                el.style = 'right:0;'
            })
            curList[index].style = style;
            this.setData({
                curList: curList
            })
        }
    },
    deleteTodo(e) {
        var _this = this;
        var id = e.currentTarget.dataset.id;
        var tempList = _this.data.list;

        tempList.forEach((el, index) => {
            el.style = 'right:0;';
            if (el.id === id) {
                wx.showModal({
                    title: '',
                    content: '确认删除此代办',
                    success: (res) => {
                        if (res.confirm) {
                            tempList.splice(index, 1);
                            _this.setCurrent(tempList);
                            wx.setStorage({
                                key: 'list',
                                data: tempList
                            })
                        } else {
                            _this.setCurrent(tempList);
                        }
                    }
                })
            }
        })
    }
})