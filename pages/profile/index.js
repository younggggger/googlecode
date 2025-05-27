// pages/profile/index.js
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    neighborhoodCreditScore: null,
    creditScoreDescriptor: '', // For "Good", "Excellent"
    trustHistory: [], // Placeholder for trust activity log
    showEditProfileModal: false,
    editableNickname: '',
    editableBio: '', // New field for profile
    // Mock profile details, in real app, this would be part of UserProfileDetails
    userProfileDetails: {
      bio: '',
      interests: '' // Example, can add more
    }
  },

  onLoad: function () {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    // Attempt to load cached user info and score on load
    const cachedUserInfo = wx.getStorageSync('userInfo');
    const cachedScore = wx.getStorageSync('neighborhoodCreditScore');
    const cachedProfileDetails = wx.getStorageSync('userProfileDetails');

    if (cachedUserInfo) {
      this.setData({
        userInfo: cachedUserInfo,
        hasUserInfo: true,
        editableNickname: cachedUserInfo.nickName
      });
    }
    if (cachedScore) {
      this.setData({ neighborhoodCreditScore: cachedScore });
      this.updateCreditScoreDescriptor(cachedScore);
    }
    if (cachedProfileDetails) {
      this.setData({ 
        userProfileDetails: cachedProfileDetails,
        editableBio: cachedProfileDetails.bio || ''
      });
    }

    // Even if cached, might want to refresh or ensure login if actions are taken
    // For this mock, we'll primarily rely on getUserProfile for initial "login"
  },

  // Call this when neighborhoodCreditScore is set or updated
  updateCreditScoreDescriptor: function(score) {
    let descriptor = '';
    if (score === null) descriptor = '';
    else if (score >= 110) descriptor = '优秀';
    else if (score >= 90) descriptor = '良好';
    else if (score >= 70) descriptor = '一般';
    else if (score >= 50) descriptor = '待提高';
    else descriptor = '需关注';
    this.setData({ creditScoreDescriptor: descriptor });
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const updatedUserInfo = { ...this.data.userInfo, ...res.userInfo };
        this.setData({
          userInfo: updatedUserInfo,
          hasUserInfo: true,
          editableNickname: updatedUserInfo.nickName // Initialize editable nickname
        });
        wx.setStorageSync('userInfo', updatedUserInfo); // Cache user info

        // Here you would typically send the userInfo to your backend to store in the database
        // and then fetch/update the neighborhoodCreditScore.
        console.log("User profile fetched:", res.userInfo);
        this.fetchNeighborhoodCreditScore(updatedUserInfo.nickName); // Pass a user identifier
        this.fetchTrustHistory(updatedUserInfo.nickName); // Fetch trust history
      },
      fail: (err) => {
        console.error("getUserProfile failed:", err);
        wx.showToast({ title: '授权失败', icon: 'none' });
      }
    });
  },

  fetchNeighborhoodCreditScore(userId) {
    console.log("Simulating fetching credit score for user:", userId);
    wx.showLoading({ title: '加载信用分...' });

    setTimeout(() => {
      let mockScore = 75; // Base score
      if (this.data.userInfo && this.data.userInfo.avatarUrl) {
        mockScore += 10;
      }
      if (this.data.userInfo && this.data.userInfo.nickName) {
        // Nickname doesn't directly add, but completeness does
      }
      if (this.data.userProfileDetails && this.data.userProfileDetails.bio) {
        mockScore += 15; // Points for having a bio
      }
      // Add more points for other profile items like interests if they were implemented

      this.setData({ neighborhoodCreditScore: mockScore });
      this.updateCreditScoreDescriptor(mockScore);
      wx.setStorageSync('neighborhoodCreditScore', mockScore); // Cache score
      wx.hideLoading();
      console.log("Mock credit score set to:", mockScore);
      this.addTrustLogEntry("PROFILE_UPDATE", mockScore > 80 ? 5: 2, "个人资料更新，信用评分调整");

    }, 1000);
  },

  fetchTrustHistory(userId) {
    console.log("Simulating fetching trust history for user:", userId);
    // In a real app, fetch from TrustActivityLog table.
    // For now, use a placeholder or mock data.
    const mockHistory = [
      // { logId: 'th1', activityType: 'PROFILE_COMPLETE', pointsChange: 10, description: '完成个人资料设置', timestamp: '2023-11-01' },
      // { logId: 'th2', activityType: 'COMMUNITY_POST', pointsChange: 2, description: '在"邻里互助群"发布求助信息', timestamp: '2023-11-03' },
    ];
    // If this.data.trustHistory is empty, we show the placeholder text in WXML
    this.setData({ trustHistory: mockHistory });
  },
  
  addTrustLogEntry(activityType, pointsChange, description) {
    // This is a mock function. In a real app, this would be a backend call.
    const newLog = {
      logId: 'log' + Date.now(),
      activityType: activityType,
      pointsChange: pointsChange,
      description: description,
      timestamp: new Date().toLocaleDateString()
    };
    console.log("Mock TrustLogEntry:", newLog);
    // For now, we don't directly add to this.data.trustHistory to keep UI simple with placeholder
    // but in a real scenario, after backend update, trustHistory would be refetched or updated.
  },

  // --- Profile Editing Modal ---
  showEditModal: function() {
    this.setData({
      showEditProfileModal: true,
      editableNickname: this.data.userInfo ? this.data.userInfo.nickName : '',
      editableBio: this.data.userProfileDetails ? this.data.userProfileDetails.bio : ''
    });
  },

  hideEditModal: function() {
    this.setData({ showEditProfileModal: false });
  },

  handleNicknameInput: function(e) {
    this.setData({ editableNickname: e.detail.value });
  },

  handleBioInput: function(e) {
    this.setData({ editableBio: e.detail.value });
  },

  saveProfileChanges: function() {
    wx.showLoading({ title: '保存中...' });

    const updatedUserInfo = { ...this.data.userInfo, nickName: this.data.editableNickname };
    const updatedProfileDetails = { ...this.data.userProfileDetails, bio: this.data.editableBio };

    // Simulate saving to backend
    setTimeout(() => {
      this.setData({
        userInfo: updatedUserInfo,
        userProfileDetails: updatedProfileDetails,
        showEditProfileModal: false
      });
      wx.setStorageSync('userInfo', updatedUserInfo);
      wx.setStorageSync('userProfileDetails', updatedProfileDetails);

      // Simulate recalculating credit score due to profile update
      this.fetchNeighborhoodCreditScore(this.data.userInfo.nickName); // Re-fetch/re-calculate score

      wx.hideLoading();
      wx.showToast({ title: '资料已更新' });
    }, 1000);
  },

  // Deprecated getUserInfo - kept for reference but not primary path
  getUserInfo(e) {
    if (e.detail.userInfo) {
      console.log("getUserInfo (deprecated) success:", e.detail.userInfo);
      const updatedUserInfo = { ...this.data.userInfo, ...e.detail.userInfo };
      this.setData({
        userInfo: updatedUserInfo,
        hasUserInfo: true,
        editableNickname: updatedUserInfo.nickName
      });
      wx.setStorageSync('userInfo', updatedUserInfo);
      this.fetchNeighborhoodCreditScore(updatedUserInfo.nickName);
      this.fetchTrustHistory(updatedUserInfo.nickName);
    } else {
      console.warn("getUserInfo (deprecated) failed or user denied.");
      // Handle case where user denies permission with the old API
    }
  }
});
