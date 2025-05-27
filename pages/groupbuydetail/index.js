// pages/groupbuydetail/index.js
Page({
  data: {
    groupBuyId: null,
    groupBuyDetails: null,
    participants: [],
    userLoggedIn: false,
    userId: null,
    hasJoined: false, // Has the current user joined this group buy?
    quantityToJoin: 1, // Default quantity when joining

    // Mock data for user credit scores - in a real app, fetch this when fetching participants
    usersData: {
      'userA': { nickname: '张三 (发起人)', neighborhoodCreditScore: 115, avatarUrl: '/assets/mock_avatar_1.png' },
      'userB': { nickname: '李四 (发起人)', neighborhoodCreditScore: 92, avatarUrl: '/assets/mock_avatar_2.png' },
      'userC': { nickname: '王五 (发起人)', neighborhoodCreditScore: 78, avatarUrl: '/assets/mock_avatar_3.png' },
      'participant1': { nickname: '热心邻居赵六', neighborhoodCreditScore: 105, avatarUrl: '/assets/avatars/avatar_p1.png' },
      'participant2': { nickname: '隔壁老王', neighborhoodCreditScore: 88, avatarUrl: '/assets/avatars/avatar_p2.png' },
      'participant3': { nickname: '小萌新', neighborhoodCreditScore: 70, avatarUrl: '/assets/avatars/avatar_p3.png' },
      'mockUserId123': { nickname: '我 (小明)', neighborhoodCreditScore: 100, avatarUrl: '/assets/mock_avatar_4.png' } // Current User
    }
  },

  onLoad: function (options) {
    this.setData({ groupBuyId: options.groupBuyId });
    
    const app = getApp();
    if (app.globalData && app.globalData.userInfo && app.globalData.userId) {
      this.setData({
        userLoggedIn: true,
        userId: app.globalData.userId
      });
    } else {
      // Mock login for development
      setTimeout(() => {
        this.setData({ userLoggedIn: true, userId: 'mockUserId123' });
        this.checkIfUserJoined(); // Check join status after mock login
      }, 500);
    }

    this.fetchGroupBuyDetails();
    this.fetchParticipants();
  },

  fetchGroupBuyDetails: function() {
    wx.showLoading({ title: '加载详情...' });
    // Simulate API call using this.data.groupBuyId
    setTimeout(() => {
      // This mock data should ideally be consistent with what's on the listing page
      const mockAllGroupBuys = {
        'gb001': { 
          groupBuyId: 'gb001', 
          title: '【产地直供】山东红富士苹果5kg', 
          description: '脆甜多汁，新鲜采摘，产地直发，无农药残留，适合全家共享。精选一级果，果径80-85mm，甜度高达15%。\n\n团购规则：\n1. 达到10箱成团。\n2. 成团后3天内发货。\n3. 支持小区内定点自提或额外付费送货上门。',
          initiatorUserId: 'userA', 
          productDetails: { name: '红富士苹果', price: 35.80, unit: '箱 (5kg)', imageUrl: '/assets/products/apples.jpg', originalPrice: 45.00 },
          minParticipants: 10, 
          currentParticipants: 7, // This should be updated by participant list length ideally
          maxParticipants: 50,
          endTime: '2024-01-15T23:59:59', 
          status: 'active',
          deliveryOptions: '小区东门自提 / 加5元送货上门 (周六统一配送)'
        },
        'gb002': { 
          groupBuyId: 'gb002', 
          title: '【暖冬必备】加厚保暖珊瑚绒四件套', 
          description: '亲肤柔软，吸湿透气，多种花色可选（备注所需花色），给您一个温暖的冬天。1.8m床适用。',
          initiatorUserId: 'userB', 
          productDetails: { name: '珊瑚绒四件套', price: 129.00, unit: '套', imageUrl: '/assets/products/bedding.jpg', originalPrice: 199.00 },
          minParticipants: 20, 
          currentParticipants: 22,
          endTime: '2024-01-10T23:59:59', 
          status: 'active',
          deliveryOptions: '指定地址包邮'
        },
         'gb003': { 
          groupBuyId: 'gb003', 
          title: '【办公室零食】每日坚果混合装750g', 
          description: '科学配比，补充能量，独立小包装，方便携带。包含巴旦木、核桃仁、腰果等。保质期6个月。',
          initiatorUserId: 'userA', 
          productDetails: { name: '每日坚果', price: 59.90, unit: '盒 (750g)', imageUrl: '/assets/products/nuts.jpg', originalPrice: 79.90 },
          minParticipants: 15, 
          currentParticipants: 5,
          endTime: '2024-01-20T23:59:59', 
          status: 'active',
          deliveryOptions: '小区物业处自提'
        }
      };
      const details = mockAllGroupBuys[this.data.groupBuyId];
      if (details) {
        details.initiatorInfo = this.data.usersData[details.initiatorUserId] || { nickname: '未知用户', neighborhoodCreditScore: 'N/A' };
        details.timeLeft = this.calculateTimeLeft(details.endTime);
        this.setData({ groupBuyDetails: details });
        wx.setNavigationBarTitle({ title: details.title });
      } else {
        wx.showToast({ title: '团购信息不存在', icon: 'error'});
      }
      wx.hideLoading();
    }, 700);
  },

  fetchParticipants: function() {
    // Simulate API call
    setTimeout(() => {
      const mockParticipantsData = {
        'gb001': [
          { participationId: 'p1', userId: 'participant1', quantity: 1, joinTime: '2023-12-28 10:00', status: 'joined' },
          { participationId: 'p2', userId: 'participant2', quantity: 2, joinTime: '2023-12-28 11:30', status: 'joined' },
        ],
        'gb002': [
          // ... more participants for gb002
        ],
        'gb003': [
           { participationId: 'p3', userId: 'participant3', quantity: 1, joinTime: '2023-12-29 09:15', status: 'joined' },
        ]
      };
      const participantsForThisGroupBuy = (mockParticipantsData[this.data.groupBuyId] || []).map(p => ({
        ...p,
        userInfo: this.data.usersData[p.userId] || { nickname: '神秘参与者', neighborhoodCreditScore: 'N/A' }
      }));
      this.setData({ participants: participantsForThisGroupBuy });
      this.checkIfUserJoined(); // Check after fetching participants
    }, 500);
  },
  
  checkIfUserJoined: function() {
    if (!this.data.userId || !this.data.participants.length) return;
    const hasJoined = this.data.participants.some(p => p.userId === this.data.userId);
    this.setData({ hasJoined: hasJoined });
  },

  calculateTimeLeft: function(endTimeStr) { // Copied from list page, can be utility
    const endTime = new Date(endTimeStr).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;
    if (diff <= 0) return "已结束";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}天${hours}小时`;
    if (hours > 0) return `${hours}小时${minutes}分钟`;
    return `${minutes}分钟`;
  },

  handleQuantityChange: function(e) {
    this.setData({ quantityToJoin: parseInt(e.detail.value) || 1 });
  },

  handleJoinGroupBuy: function() {
    if (!this.data.userLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      // Optionally redirect to login/profile page
      return;
    }
    if (this.data.hasJoined) {
      wx.showToast({ title: '您已参与此团购', icon: 'none' });
      return;
    }
    if (this.data.groupBuyDetails && this.data.groupBuyDetails.status !== 'active') {
      wx.showToast({ title: '此团购已结束或未开始', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在加入...' });
    // Simulate API call to join group buy
    setTimeout(() => {
      const newParticipant = {
        participationId: 'p' + Date.now(),
        userId: this.data.userId,
        quantity: this.data.quantityToJoin,
        joinTime: new Date().toLocaleString(),
        status: 'joined',
        userInfo: this.data.usersData[this.data.userId] || { nickname: '我', neighborhoodCreditScore: 'N/A' }
      };
      
      // Update local data
      this.setData({
        participants: [...this.data.participants, newParticipant],
        hasJoined: true,
        'groupBuyDetails.currentParticipants': (this.data.groupBuyDetails.currentParticipants || 0) + 1 // Increment participant count
      });
      
      // Mock adding to TrustActivityLog
      this.addTrustLogEntry('GROUP_BUY_PARTICIPATE_SUCCESS', 2, `成功加入团购: ${this.data.groupBuyDetails.title.substring(0,10)}...`);

      wx.hideLoading();
      wx.showToast({ title: '加入成功!', icon: 'success' });
    }, 1000);
  },
  
  addTrustLogEntry(activityType, pointsChange, description) {
    // This is a mock function. In a real app, this would be a backend call.
    // For actual implementation, refer to cloud_functions.md
    console.log("Mock TrustLogEntry (from GroupBuyDetail):", {
      userId: this.data.userId,
      activityType: activityType,
      pointsChange: pointsChange,
      description: description,
      relatedId: this.data.groupBuyId,
      timestamp: new Date().toISOString()
    });
    // This log would then be visible in the user's trust history on their profile page after backend processing.
  },

  previewImage: function(e) {
    const imageUrl = e.currentTarget.dataset.url;
    if (imageUrl) {
      wx.previewImage({
        current: imageUrl,
        urls: [imageUrl]
      });
    }
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.fetchGroupBuyDetails();
    this.fetchParticipants();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500);
  },

  onShareAppMessage: function () {
    // Custom sharing message for this group buy
    if (this.data.groupBuyDetails) {
      return {
        title: `[邻里团] ${this.data.groupBuyDetails.title}`,
        path: `/pages/groupbuydetail/index?groupBuyId=${this.data.groupBuyId}`,
        imageUrl: this.data.groupBuyDetails.productDetails.imageUrl // Optional: if you have a good image
      };
    }
    return {
      title: '邻里团购，实惠多多！',
      path: '/pages/groupbuy/index'
    };
  }
});
