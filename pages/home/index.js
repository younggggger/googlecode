// pages/home/index.js
Page({
  data: {
    announcements: [],
    highlightedGroupBuys: [],
    highlightedServices: [],
    // Mock data for user credit scores and details, to be used by group buys and services
    usersData: {
      'userA': { nickname: '发起人张三', neighborhoodCreditScore: 115, avatarUrl: '/assets/mock_avatar_1.png' },
      'userB': { nickname: '发起人李四', neighborhoodCreditScore: 92, avatarUrl: '/assets/mock_avatar_2.png' },
      'userS1': { nickname: '巧手王阿姨', neighborhoodCreditScore: 120, avatarUrl: '/assets/avatars/avatar_s1.png' },
      'userS2': { nickname: '数学小王子', neighborhoodCreditScore: 105, avatarUrl: '/assets/avatars/avatar_s2.png' },
      'userHighTrust': { nickname: '雷锋邻居', neighborhoodCreditScore: 130, avatarUrl: '/assets/avatars/avatar_champion.png'}
    }
  },

  onLoad: function (options) {
    this.fetchHomePageData();
  },

  fetchHomePageData: function() {
    wx.showLoading({ title: '加载中...' });
    this.fetchAnnouncements();
    this.fetchHighlightedGroupBuys();
    this.fetchHighlightedServices();
    // No separate fetch for Trust Champions yet, as it's a placeholder section
    setTimeout(() => { // Simulate overall loading time
      wx.hideLoading();
    }, 800);
  },

  fetchAnnouncements: function() {
    // Simulate API call
    const mockAnnouncements = [
      { announcementId: 'anno001', title: '小区春节联欢晚会报名通知', content: '一年一度的春节联欢晚会开始报名啦！有才艺的邻居们请到物业处报名...', author: '物业管理处', createdAt: '2024-01-10 09:00:00', type: 'Event' },
      { announcementId: 'anno002', title: '冬季供暖水管维护通知', content: '为保障冬季供暖，本周六将对小区供暖水管进行维护，届时可能会短暂停水...', author: '社区委员会', createdAt: '2024-01-09 14:00:00', type: 'Maintenance' },
    ];
    this.setData({ announcements: mockAnnouncements.slice(0, 2) }); // Show top 2
  },

  fetchHighlightedGroupBuys: function() {
    // Simulate API call and prioritization logic
    const mockGroupBuys = [
      { 
        groupBuyId: 'gb001', 
        title: '【产地直供】山东红富士苹果5kg', 
        initiatorUserId: 'userA', 
        productDetails: { name: '红富士苹果', price: 35.80, unit: '箱 (5kg)', imageUrl: '/assets/products/apples.jpg' },
        minParticipants: 10, currentParticipants: 9, // Close to goal
        priorityScore: 10 // Higher score for being close to goal
      },
      { 
        groupBuyId: 'gb002', 
        title: '【暖冬必备】加厚保暖珊瑚绒四件套', 
        initiatorUserId: 'userHighTrust', // High trust initiator
        productDetails: { name: '珊瑚绒四件套', price: 129.00, unit: '套', imageUrl: '/assets/products/bedding.jpg' },
        minParticipants: 20, currentParticipants: 5,
        priorityScore: 15 // Higher score for high trust initiator
      },
      { 
        groupBuyId: 'gb003', 
        title: '【办公室零食】每日坚果混合装750g', 
        initiatorUserId: 'userB', 
        productDetails: { name: '每日坚果', price: 59.90, unit: '盒 (750g)', imageUrl: '/assets/products/nuts.jpg' },
        minParticipants: 15, currentParticipants: 2,
        priorityScore: 5
      }
    ];

    const highlighted = mockGroupBuys
      .sort((a, b) => b.priorityScore - a.priorityScore) // Sort by priority
      .slice(0, 2) // Take top 2
      .map(gb => ({
        ...gb,
        initiatorInfo: this.data.usersData[gb.initiatorUserId] || { nickname: '未知用户', neighborhoodCreditScore: 'N/A' }
      }));
    this.setData({ highlightedGroupBuys: highlighted });
  },

  fetchHighlightedServices: function() {
    // Simulate API call and prioritization
    const mockServices = [
      { 
        serviceId: 'serv001', 
        providerUserId: 'userS1', // High trust provider
        title: '周末家务帮手 (打扫/做饭)', 
        category: '家政服务', 
        price: '50元/小时',
        priorityScore: 15 // High trust provider
      },
      { 
        serviceId: 'serv002', 
        providerUserId: 'userS2', 
        title: '中小学数学辅导', 
        category: '教育辅导', 
        price: '80元/小时 (在线)',
        priorityScore: 10 // Newly offered / popular
      },
      { 
        serviceId: 'serv003', 
        providerUserId: 'userS3', 
        title: '节假日宠物猫咪寄养', 
        category: '宠物照看', 
        price: '30元/天/只',
        priorityScore: 5
      }
    ];

    const highlighted = mockServices
      .sort((a, b) => b.priorityScore - a.priorityScore) // Sort by priority
      .slice(0, 2) // Take top 2
      .map(s => ({
        ...s,
        providerInfo: this.data.usersData[s.providerUserId] || { nickname: '未知用户', neighborhoodCreditScore: 'N/A' }
      }));
    this.setData({ highlightedServices: highlighted });
  },

  navigateToGroupBuyDetail: function(e) {
    const groupBuyId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/groupbuydetail/index?groupBuyId=${groupBuyId}` });
  },

  navigateToServiceDetail: function(e) {
    const serviceId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/servicedetail/index?serviceId=${serviceId}` });
  },

  navigateToAllGroupBuys: function() {
    wx.switchTab({ url: '/pages/groupbuy/index' });
  },

  navigateToAllServices: function() {
    wx.switchTab({ url: '/pages/services/index' });
  },
  
  navigateToAnnouncementDetail: function(e) {
    const announcementId = e.currentTarget.dataset.id;
    // For now, just show a modal as there's no dedicated announcement detail page
    const announcement = this.data.announcements.find(a => a.announcementId === announcementId);
    if (announcement) {
      wx.showModal({
        title: announcement.title,
        content: `${announcement.content}\n\n发布者: ${announcement.author}\n时间: ${announcement.createdAt.split(' ')[0]}`, // Simple formatting
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.fetchHomePageData();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
