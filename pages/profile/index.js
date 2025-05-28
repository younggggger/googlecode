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
    },
    endorsementsReceived: [],
    showEndorsementModal: false,
    endorsementTypes: ['乐于助人', '诚信可靠', '优秀团长', '技能分享达人', '友善邻居'],
    selectedEndorsementType: '',
    endorsementComment: '',
    // For mocking: assume we are viewing another user's profile for endorsement
    // In a real app, this would be the userId of the profile being viewed.
    // For now, we'll use a mock ID if the user wants to "endorse" someone.
    // If this page is *only* for the logged-in user's profile, then endorsing others
    // would happen on a different "view user profile" page.
    // For this subtask, we'll add the UI to *this* profile page,
    // and simulate that the "endorse" button is for endorsing *this* user by *another* (mocked) user.
    // This is a bit artificial but allows implementing the UI elements.
    profileBeingViewedUserId: 'mockUserBeingViewedId' // Assume this is the ID of the user whose profile is shown
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
        this.fetchNeighborhoodCreditScore(updatedUserInfo.nickName);
        this.fetchTrustHistory(updatedUserInfo.nickName);
        this.fetchEndorsementsReceived(this.data.profileBeingViewedUserId); // Fetch endorsements for the currently viewed profile
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
    // Also attempt to load endorsements if user info was cached
    if(this.data.hasUserInfo){
        this.fetchEndorsementsReceived(this.data.profileBeingViewedUserId);
    }
  },
  
  fetchEndorsementsReceived: function(userId) {
    console.log("Simulating fetching endorsements for user:", userId);
    // In a real app, fetch from UserEndorsements table where endorseeUserId === userId
    const mockEndorsements = [
      { endorsementId: 'end001', endorserUserId: 'userFriendA', endorserNickname: '热心邻居小王', endorsementType: '乐于助人', comment: '上次帮我搬了重物，非常感谢！', createdAt: '2023-12-01' },
      { endorsementId: 'end002', endorserUserId: 'userFriendB', endorserNickname: '团购买家小李', endorsementType: '优秀团长', comment: '组织的团购很棒，物美价廉。', createdAt: '2023-11-15' },
      { endorsementId: 'end003', endorserUserId: 'userFriendC', endorserNickname: '社区常客老张', endorsementType: '友善邻居', comment: '', createdAt: '2023-10-20' },
    ];
    // For this mock, we always show these for 'mockUserBeingViewedId'.
    // If this.data.userInfo.userId (logged-in user) === userId, then these are their own endorsements.
    if (userId === this.data.profileBeingViewedUserId) {
        this.setData({ endorsementsReceived: mockEndorsements });
    } else {
        this.setData({ endorsementsReceived: [] }); // Clear if not viewing the "target" profile
    }
  },

  addTrustLogEntry(activityType, pointsChange, description, relatedUserId = null) {
    // This is a mock function. In a real app, this would be a backend call.
    const newLog = {
      logId: 'log' + Date.now(),
      userId: this.data.userId, // The user performing the action or affected
      activityType: activityType,
      pointsChange: pointsChange,
      description: description,
      timestamp: new Date().toLocaleDateString(),
      relatedId: relatedUserId || this.data.profileBeingViewedUserId // context-dependent related ID
    };
    console.log("Mock TrustLogEntry:", newLog);
    // Potentially add to this.data.trustHistory if it's for the current user and page needs to update
    // For now, trust history is just a placeholder.
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
      this.fetchEndorsementsReceived(this.data.profileBeingViewedUserId);
    } else {
      console.warn("getUserInfo (deprecated) failed or user denied.");
      // Handle case where user denies permission with the old API
    }
  },

  // --- Endorsement Modal ---
  openEndorseModal: function() {
    // Prevent endorsing oneself - in a real app, this button might only appear on others' profiles.
    // For this mock, if profileBeingViewedUserId is the logged-in user, disable.
    if (this.data.userId === this.data.profileBeingViewedUserId && this.data.hasUserInfo) {
        // This logic is a bit mixed up due to the mock setup.
        // Ideally, you wouldn't show "Endorse [This User's Name]" on their own profile page.
        // Or, if it's a generic "Give an Endorsement" button, it would require searching for a user.
        // For now, we'll allow opening it but it will "endorse" profileBeingViewedUserId.
        // wx.showToast({ title: '您不能为自己背书哦', icon: 'none' });
        // return;
    }
    if (!this.data.hasUserInfo) {
        wx.showToast({ title: '请先登录', icon: 'none'});
        return;
    }
    this.setData({ showEndorsementModal: true, selectedEndorsementType: '', endorsementComment: '' });
  },

  closeEndorseModal: function() {
    this.setData({ showEndorsementModal: false });
  },

  onEndorsementTypeChange: function(e) {
    this.setData({ selectedEndorsementType: this.data.endorsementTypes[e.detail.value] });
  },

  handleEndorsementCommentInput: function(e) {
    this.setData({ endorsementComment: e.detail.value });
  },

  submitEndorsement: function() {
    if (!this.data.selectedEndorsementType) {
      wx.showToast({ title: '请选择背书类型', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '提交中...' });
    // Simulate API call to create UserEndorsement
    setTimeout(() => {
      const endorsementData = {
        endorsementId: 'end' + Date.now(),
        endorserUserId: this.data.userId, // Current logged-in user
        endorseeUserId: this.data.profileBeingViewedUserId, // The user whose profile is being viewed
        endorsementType: this.data.selectedEndorsementType,
        comment: this.data.endorsementComment,
        createdAt: new Date().toISOString().split('T')[0]
      };
      console.log("Mock Endorsement Created:", endorsementData);

      // Add to local list for immediate UI update (if viewing own profile and someone endorsed you)
      // Or, if this is for endorsing others, this update isn't for the current page's displayed list.
      // For this mock, if we are "viewing" the target user, we add it to their list.
      if (this.data.profileBeingViewedUserId === endorsementData.endorseeUserId) {
          const newEndorsementForDisplay = {
              ...endorsementData,
              endorserNickname: this.data.userInfo.nickName // Current user's nickname
          };
          this.setData({
            endorsementsReceived: [newEndorsementForDisplay, ...this.data.endorsementsReceived]
          });
      }
      
      // Log trust activities
      this.addTrustLogEntry('ENDORSEMENT_GIVEN', 1, `为你赞赏了 ${this.data.usersData[this.data.profileBeingViewedUserId]?.nickname || '用户'} (${this.data.selectedEndorsementType})`, this.data.profileBeingViewedUserId);
      // The endorsed user would get a separate log on their side.
      // This is a conceptual point, actual point change for ENDORSEMENT_RECEIVED would be backend.
      // this.addTrustLogEntry('ENDORSEMENT_RECEIVED', 2, `收到来自 ${this.data.userInfo.nickName} 的赞赏 (${this.data.selectedEndorsementType})`, this.data.profileBeingViewedUserId);


      wx.hideLoading();
      this.setData({ showEndorsementModal: false });
      wx.showToast({ title: '感谢您的赞赏!', icon: 'success' });
    }, 1000);
  }
});
