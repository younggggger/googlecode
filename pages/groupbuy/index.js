// pages/groupbuy/index.js
Page({
  data: {
    groupBuys: [],
    userLoggedIn: false,
    userId: null,
    // Mock data for user credit scores - in a real app, fetch this when fetching group buys or users
    usersData: {
      'userA': { nickname: '发起人张三', neighborhoodCreditScore: 115, avatarUrl: '/assets/mock_avatar_1.png' },
      'userB': { nickname: '发起人李四', neighborhoodCreditScore: 92, avatarUrl: '/assets/mock_avatar_2.png' },
      'userC': { nickname: '发起人王五', neighborhoodCreditScore: 78, avatarUrl: '/assets/mock_avatar_3.png' },
      'mockUserId123': { nickname: '我 (小明)', neighborhoodCreditScore: 100, avatarUrl: '/assets/mock_avatar_4.png' }
    }
  },

  onLoad: function (options) {
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
      }, 500);
    }
    this.fetchGroupBuys();
  },

  fetchGroupBuys: function() {
    wx.showLoading({ title: '加载团购中...' });
    // Simulate API call
    setTimeout(() => {
      const mockGroupBuys = [
        { 
          groupBuyId: 'gb001', 
          title: '【产地直供】山东红富士苹果5kg', 
          description: '脆甜多汁，新鲜采摘，产地直发，无农药残留，适合全家共享。',
          initiatorUserId: 'userA', 
          productDetails: { name: '红富士苹果', price: 35.80, unit: '箱 (5kg)', imageUrl: '/assets/products/apples.jpg' },
          minParticipants: 10, 
          currentParticipants: 7,
          endTime: '2024-01-15T23:59:59', 
          status: 'active'
        },
        { 
          groupBuyId: 'gb002', 
          title: '【暖冬必备】加厚保暖珊瑚绒四件套', 
          description: '亲肤柔软，吸湿透气，多种花色可选，给您一个温暖的冬天。',
          initiatorUserId: 'userB', 
          productDetails: { name: '珊瑚绒四件套', price: 129.00, unit: '套', imageUrl: '/assets/products/bedding.jpg' },
          minParticipants: 20, 
          currentParticipants: 22,
          endTime: '2024-01-10T23:59:59', 
          status: 'active' 
        },
        { 
          groupBuyId: 'gb003', 
          title: '【办公室零食】每日坚果混合装750g', 
          description: '科学配比，补充能量，独立小包装，方便携带。包含巴旦木、核桃仁、腰果等。',
          initiatorUserId: 'userA', 
          productDetails: { name: '每日坚果', price: 59.90, unit: '盒 (750g)', imageUrl: '/assets/products/nuts.jpg' },
          minParticipants: 15, 
          currentParticipants: 5,
          endTime: '2024-01-20T23:59:59', 
          status: 'active' 
        },
        { 
          groupBuyId: 'gb004', 
          title: '【手工烘焙】圣诞限定款饼干礼盒', 
          description: '纯手工制作，无添加剂，造型可爱，圣诞送礼佳选。',
          initiatorUserId: 'userC', 
          productDetails: { name: '圣诞饼干礼盒', price: 88.00, unit: '盒', imageUrl: '/assets/products/cookies.jpg' },
          minParticipants: 5, 
          currentParticipants: 8,
          endTime: '2023-12-20T23:59:59', // Already ended
          status: 'completed' 
        }
      ];
      
      const activeGroupBuys = mockGroupBuys
        .filter(gb => gb.status === 'active')
        .map(gb => ({
          ...gb,
          initiatorInfo: this.data.usersData[gb.initiatorUserId] || { nickname: '未知用户', neighborhoodCreditScore: 'N/A' },
          // Simple time left calculation (very basic)
          timeLeft: this.calculateTimeLeft(gb.endTime)
        }));

      this.setData({ groupBuys: activeGroupBuys });
      wx.hideLoading();
    }, 1000);
  },

  calculateTimeLeft: function(endTimeStr) {
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

  navigateToGroupBuyDetail: function(e) {
    const groupBuyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/groupbuydetail/index?groupBuyId=${groupBuyId}`
    });
  },

  navigateToCreateGroupBuy: function() {
    wx.showModal({
      title: '敬请期待',
      content: '发起团购功能正在火热开发中，很快就能和大家见面啦！',
      showCancel: false,
      confirmText: '知道了'
    });
    // Later: wx.navigateTo({ url: '/pages/creategroupbuy/index' });
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.fetchGroupBuys();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500);
  }
});
