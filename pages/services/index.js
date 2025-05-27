// pages/services/index.js
Page({
  data: {
    services: [],
    categories: ['全部', '家政服务', '教育辅导', '宠物照看', '技术支持', '手工劳动', '美容健康', '活动帮助', '其他'],
    selectedCategory: '全部',
    userLoggedIn: false,
    userId: null,
    // Mock data for user credit scores
    usersData: {
      'userS1': { nickname: '巧手王阿姨', neighborhoodCreditScore: 120, avatarUrl: '/assets/avatars/avatar_s1.png' },
      'userS2': { nickname: '数学小王子', neighborhoodCreditScore: 105, avatarUrl: '/assets/avatars/avatar_s2.png' },
      'userS3': { nickname: '爱宠人士小李', neighborhoodCreditScore: 95, avatarUrl: '/assets/avatars/avatar_s3.png' },
      'userS4': { nickname: '电脑达人老张', neighborhoodCreditScore: 110, avatarUrl: '/assets/avatars/avatar_s4.png' },
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
    this.fetchServices();
  },

  fetchServices: function() {
    wx.showLoading({ title: '加载服务中...' });
    // Simulate API call
    setTimeout(() => {
      const mockServices = [
        { 
          serviceId: 'serv001', 
          providerUserId: 'userS1', 
          title: '周末家务帮手 (打扫/做饭)', 
          description: '周末时间提供家务服务，包括房间清洁、做家常菜（3-4菜一汤）。经验丰富，手脚麻利。',
          category: '家政服务', 
          price: '50元/小时', 
          availability: '周六、周日下午', 
          status: 'active' 
        },
        { 
          serviceId: 'serv002', 
          providerUserId: 'userS2', 
          title: '中小学数学辅导', 
          description: '本人985数学系在读，可提供小学、初中数学在线或上门辅导，帮助孩子提升解题技巧和数学思维。',
          category: '教育辅导', 
          price: '80元/小时 (在线)', 
          availability: '工作日晚上, 周末全天', 
          status: 'active' 
        },
        { 
          serviceId: 'serv003', 
          providerUserId: 'userS3', 
          title: '节假日宠物猫咪寄养', 
          description: '节假日出门旅游，家中猫咪无人照看？本人提供家庭式猫咪寄养服务，每日喂食、铲屎、陪伴玩耍，可视频反馈。',
          category: '宠物照看', 
          price: '30元/天/只', 
          availability: '法定节假日', 
          status: 'active' 
        },
        { 
          serviceId: 'serv004', 
          providerUserId: 'userS4', 
          title: '电脑/网络问题上门维修', 
          description: '解决各种电脑软硬件问题，网络故障排查，打印机设置等。多年IT经验，收费公道。',
          category: '技术支持', 
          price: '起步价50元，按复杂程度议价', 
          availability: '工作日晚上，周末可预约', 
          status: 'active' 
        },
        { 
          serviceId: 'serv005', 
          providerUserId: 'userS1', 
          title: '代取代送快递（限本小区）', 
          description: '上班不方便拿快递？我可以帮您代取，并送上门。仅限本小区内，大件另议。',
          category: '其他', 
          price: '3元/件', 
          availability: '每天下午5-7点', 
          status: 'active' 
        }
      ];
      
      const processedServices = mockServices
        .filter(s => s.status === 'active' && (this.data.selectedCategory === '全部' || s.category === this.data.selectedCategory))
        .map(s => ({
          ...s,
          providerInfo: this.data.usersData[s.providerUserId] || { nickname: '未知用户', neighborhoodCreditScore: 'N/A', avatarUrl: '/assets/default_avatar.png' }
        }));

      this.setData({ services: processedServices });
      wx.hideLoading();
    }, 1000);
  },
  
  onCategoryChange: function(e) {
    const selectedIndex = e.detail.value;
    this.setData({
      selectedCategory: this.data.categories[selectedIndex]
    });
    this.fetchServices(); // Refetch services based on new category
  },

  navigateToServiceDetail: function(e) {
    const serviceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/servicedetail/index?serviceId=${serviceId}`
    });
  },

  navigateToOfferService: function() {
    wx.showModal({
      title: '敬请期待',
      content: '提供服务功能正在精心筹备中，让您的技能帮助更多邻居！',
      showCancel: false,
      confirmText: '我了解了'
    });
    // Later: wx.navigateTo({ url: '/pages/offerservice/index' });
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.fetchServices();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500);
  }
});
