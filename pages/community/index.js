// pages/community/index.js
Page({
  data: {
    groups: [],
    userLoggedIn: false, // Assume we can check if the user is logged in
    userId: null, // Assume we have the current user's ID
    // Mock data for which groups the user has joined. In a real app, this comes from the backend.
    // Key: groupId, Value: true if joined
    joinedGroups: {}
  },

  onLoad: function (options) {
    // Simulate checking user login status
    // In a real app, you'd get this from globalData or a login check
    const app = getApp(); // Assuming app.js has some global user state
    if (app.globalData && app.globalData.userInfo && app.globalData.userId) {
      this.setData({
        userLoggedIn: true,
        userId: app.globalData.userId
      });
    } else {
      // For mock purposes, let's assume user is logged in after a delay
      setTimeout(() => {
        this.setData({ userLoggedIn: true, userId: 'mockUserId123' });
        this.fetchJoinedGroups(); // Fetch joined groups after "login"
      }, 500);
    }
    this.fetchGroups();
  },

  onShow: function() {
    // Refresh joined groups status when page is shown, in case it changed on another page
    if (this.data.userLoggedIn) {
      this.fetchJoinedGroups();
    }
     // If groups were fetched on load, you might want to refresh them too or use a pull-down-refresh
  },

  fetchGroups: function() {
    wx.showLoading({ title: '加载中...' });
    // Simulate API call to get groups
    setTimeout(() => {
      const mockGroups = [
        { groupId: 'group1', groupName: '邻里互助群', groupDescription: '小区业主互帮互助，资源共享。', creatorUserId: 'userA', memberCount: 120 },
        { groupId: 'group2', groupName: '周末羽毛球俱乐部', groupDescription: '每周六下午3点，体育馆B场，欢迎新手！', creatorUserId: 'userB', memberCount: 45 },
        { groupId: 'group3', groupName: '母婴交流天地', groupDescription: '宝妈宝爸育儿经验分享，二手闲置。', creatorUserId: 'userC', memberCount: 88 },
        { groupId: 'group4', groupName: '宠物家长联盟', groupDescription: '晒萌宠，交流养宠心得，寻找遛狗伙伴。', creatorUserId: 'userD', memberCount: 60 }
      ];
      this.setData({ groups: mockGroups });
      wx.hideLoading();
    }, 1000);
  },

  fetchJoinedGroups: function() {
    // Simulate API call to get the list of groups the current user has joined
    // This would typically return an array of groupIds or a map
    console.log("Fetching joined groups for user:", this.data.userId);
    const mockUserJoinedGroups = { // Simulating that user 'mockUserId123' joined group1 and group3
      'group1': true,
      'group3': true
    };
    // In a real app, if this.data.userId is null, you wouldn't fetch.
    if(this.data.userId) {
        // For now, we just set it directly.
        // In a real app, you would fetch this from your `GroupMembers` table.
        this.setData({ joinedGroups: mockUserJoinedGroups });
    }
  },

  handleJoinGroup: function(e) {
    if (!this.data.userLoggedIn || !this.data.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const groupId = e.currentTarget.dataset.groupid;
    wx.showLoading({ title: '正在加入...' });
    // Simulate API call to join group
    setTimeout(() => {
      // Update mock joinedGroups state
      const updatedJoinedGroups = { ...this.data.joinedGroups, [groupId]: true };
      this.setData({ joinedGroups: updatedJoinedGroups });
      wx.hideLoading();
      wx.showToast({ title: '加入成功!', icon: 'success' });
      // Optionally, update member count locally or refetch group list
    }, 500);
  },

  handleLeaveGroup: function(e) {
    if (!this.data.userLoggedIn || !this.data.userId) {
      // This check might be redundant if button isn't shown, but good for safety
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const groupId = e.currentTarget.dataset.groupid;
    wx.showLoading({ title: '正在退出...' });
    // Simulate API call to leave group
    setTimeout(() => {
      const updatedJoinedGroups = { ...this.data.joinedGroups };
      delete updatedJoinedGroups[groupId];
      this.setData({ joinedGroups: updatedJoinedGroups });
      wx.hideLoading();
      wx.showToast({ title: '已退出群组', icon: 'none' });
      // Optionally, update member count locally or refetch group list
    }, 500);
  },

  navigateToGroupDetail: function(e) {
    const groupId = e.currentTarget.dataset.groupid;
    const groupName = e.currentTarget.dataset.groupname;
    wx.navigateTo({
      url: `/pages/groupdetail/index?groupId=${groupId}&groupName=${encodeURIComponent(groupName)}`
    });
  },

  navigateToCreateGroup: function() {
    // For now, leads to a "Coming Soon" or simple alert
    wx.showModal({
      title: '敬请期待',
      content: '创建群组功能正在开发中，很快就能和大家见面啦！',
      showCancel: false,
      confirmText: '知道了'
    });
    // Later, this would navigate to a new page:
    // wx.navigateTo({ url: '/pages/creategroup/index' });
  },

  // Optional: Pull down to refresh
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); // Show loading animation on navigation bar
    this.fetchGroups();
    if (this.data.userLoggedIn) {
      this.fetchJoinedGroups();
    }
    // Simulate async operation completion
    setTimeout(() => {
      wx.hideNavigationBarLoading(); // Hide loading animation
      wx.stopPullDownRefresh(); // Stop pull-down refresh
    }, 1500);
  }
});
