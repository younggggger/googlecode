// pages/servicedetail/index.js
Page({
  data: {
    serviceId: null,
    serviceDetails: null,
    userLoggedIn: false,
    userId: null,
    // Mock data for user credit scores - in a real app, fetch this when fetching service details or provider
    usersData: {
      'userS1': { nickname: '巧手王阿姨', neighborhoodCreditScore: 120, avatarUrl: '/assets/avatars/avatar_s1.png', bio: '热爱生活，乐于助人，家务小能手。' },
      'userS2': { nickname: '数学小王子', neighborhoodCreditScore: 105, avatarUrl: '/assets/avatars/avatar_s2.png', bio: '耐心细致，擅长启发式教学。' },
      'userS3': { nickname: '爱宠人士小李', neighborhoodCreditScore: 95, avatarUrl: '/assets/avatars/avatar_s3.png', bio: '猫咪狗狗的好朋友，寄养经验丰富。'},
      'userS4': { nickname: '电脑达人老张', neighborhoodCreditScore: 110, avatarUrl: '/assets/avatars/avatar_s4.png', bio: '专治各种电脑疑难杂症。'},
      'mockUserId123': { nickname: '我 (小明)', neighborhoodCreditScore: 100, avatarUrl: '/assets/mock_avatar_4.png' } // Current User
    },
    showRequestModal: false,
    requestMessage: '',
    preferredTime: ''
  },

  onLoad: function (options) {
    this.setData({ serviceId: options.serviceId });
    
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

    this.fetchServiceDetails();
  },

  fetchServiceDetails: function() {
    wx.showLoading({ title: '加载详情...' });
    // Simulate API call using this.data.serviceId
    setTimeout(() => {
      const mockAllServices = {
        'serv001': { 
          serviceId: 'serv001', 
          providerUserId: 'userS1', 
          title: '周末家务帮手 (打扫/做饭)', 
          description: '周末时间提供家务服务，包括房间清洁、做家常菜（3-4菜一汤）。经验丰富，手脚麻利。\n\n可提供服务范围：\n- 日常清洁（地板、家具、厨房、卫生间）\n- 深度清洁（需提前沟通）\n- 烹饪家常菜（可根据口味调整）\n\n注意事项：请提前一天预约，清洁工具需自备或协商。',
          category: '家政服务', 
          price: '50元/小时', 
          availability: '周六、周日下午 (14:00 - 18:00)', 
          status: 'active' 
        },
        'serv002': { 
          serviceId: 'serv002', 
          providerUserId: 'userS2', 
          title: '中小学数学辅导', 
          description: '本人985数学系在读，可提供小学、初中数学在线或上门辅导，帮助孩子提升解题技巧和数学思维。\n\n辅导内容：\n- 同步课程辅导\n- 考前冲刺复习\n- 数学竞赛入门\n\n教学特点：善于沟通，有耐心，能够针对不同学生制定个性化辅导方案。',
          category: '教育辅导', 
          price: '80元/小时 (在线), 100元/小时 (上门)', 
          availability: '工作日晚上 (19:00-21:00), 周末全天', 
          status: 'active' 
        },
        'serv003': { 
          serviceId: 'serv003', 
          providerUserId: 'userS3', 
          title: '节假日宠物猫咪寄养', 
          description: '节假日出门旅游，家中猫咪无人照看？本人提供家庭式猫咪寄养服务，每日喂食、铲屎、陪伴玩耍，可视频反馈。\n\n寄养条件：\n- 猫咪健康，已驱虫免疫\n- 自备猫粮、猫砂及日常用品\n- 谢绝有攻击性或严重应激反应的猫咪\n\n环境：家中环境舒适，有足够活动空间，无其他宠物。',
          category: '宠物照看', 
          price: '30元/天/只 (自带用品), 40元/天/只 (包猫粮猫砂)', 
          availability: '法定节假日及部分周末 (需提前一周预约)', 
          status: 'active' 
        },
         'serv004': { 
          serviceId: 'serv004', 
          providerUserId: 'userS4', 
          title: '电脑/网络问题上门维修', 
          description: '解决各种电脑软硬件问题，网络故障排查，打印机设置等。多年IT经验，收费公道。\n\n服务项目：\n- 系统重装、系统优化\n- 病毒查杀、数据恢复（部分）\n- 家庭网络组建、路由器设置\n- 打印机共享、常见故障排除\n\n承诺：修不好不收费（基本检测费除外）。',
          category: '技术支持', 
          price: '起步价50元，按复杂程度议价', 
          availability: '工作日晚上，周末可预约', 
          status: 'active' 
        },
        'serv005': { 
          serviceId: 'serv005', 
          providerUserId: 'userS1', 
          title: '代取代送快递（限本小区）', 
          description: '上班不方便拿快递？我可以帮您代取，并送上门。仅限本小区内，大件另议。\n请提供取件码和具体楼栋单元号。',
          category: '其他', 
          price: '3元/件 (小件), 5元/件 (中件)', 
          availability: '每天下午5-7点', 
          status: 'active' 
        }
      };
      const details = mockAllServices[this.data.serviceId];
      if (details) {
        details.providerInfo = this.data.usersData[details.providerUserId] || { nickname: '未知用户', neighborhoodCreditScore: 'N/A', avatarUrl: '/assets/default_avatar.png', bio: '暂无简介' };
        this.setData({ serviceDetails: details });
        wx.setNavigationBarTitle({ title: details.title });
      } else {
        wx.showToast({ title: '服务信息不存在', icon: 'error'});
      }
      wx.hideLoading();
    }, 700);
  },

  openRequestModal: function() {
    if (!this.data.userLoggedIn) {
      wx.showToast({ title: '请先登录才能请求服务', icon: 'none' });
      // Consider navigating to profile page for login
      return;
    }
    if (this.data.serviceDetails && this.data.serviceDetails.providerUserId === this.data.userId) {
      wx.showToast({ title: '您不能请求自己的服务', icon: 'none' });
      return;
    }
    this.setData({ showRequestModal: true, requestMessage: '', preferredTime: '' });
  },

  closeRequestModal: function() {
    this.setData({ showRequestModal: false });
  },

  handleRequestMessageInput: function(e) {
    this.setData({ requestMessage: e.detail.value });
  },

  handlePreferredTimeInput: function(e) {
    this.setData({ preferredTime: e.detail.value });
  },

  submitServiceRequest: function() {
    if (this.data.requestMessage.trim() === '') {
      wx.showToast({ title: '请填写请求详情', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在发送请求...' });
    // Simulate API call to create ServiceRequest
    setTimeout(() => {
      const requestData = {
        requestId: 'req' + Date.now(),
        serviceId: this.data.serviceId,
        requesterUserId: this.data.userId,
        providerUserId: this.data.serviceDetails.providerUserId,
        requestDetails: this.data.requestMessage,
        preferredTime: this.data.preferredTime,
        status: 'pending_approval', // Initial status
        createdAt: new Date().toISOString()
      };
      console.log("Mock Service Request Created:", requestData);
      
      // Mock adding to TrustActivityLog for the requester making a request
      // Points for actual completion will be handled later.
      // This is more of a conceptual log of initiating a service interaction.
      this.addTrustLogEntry('SERVICE_REQUEST_SENT', 1, `发起了对服务 '${this.data.serviceDetails.title.substring(0,10)}...' 的请求`);

      wx.hideLoading();
      this.setData({ showRequestModal: false });
      wx.showToast({ title: '请求已发送!', icon: 'success' });
      
      // In a real app, you might navigate to a "My Requests" page or update UI
    }, 1000);
  },
  
  addTrustLogEntry(activityType, pointsChange, description) {
    // This is a mock function. In a real app, this would be a backend call.
    console.log("Mock TrustLogEntry (from ServiceDetail):", {
      userId: this.data.userId, // User performing the action
      activityType: activityType,
      pointsChange: pointsChange,
      description: description,
      relatedId: this.data.serviceId, // Could be serviceId or requestId
      timestamp: new Date().toISOString()
    });
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.fetchServiceDetails();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500);
  },

  onShareAppMessage: function () {
    if (this.data.serviceDetails) {
      return {
        title: `[邻里服务] ${this.data.serviceDetails.title} - 由 ${this.data.serviceDetails.providerInfo.nickname} 提供`,
        path: `/pages/servicedetail/index?serviceId=${this.data.serviceId}`,
        // imageUrl: this.data.serviceDetails.providerInfo.avatarUrl // Optional: if you have a service image
      };
    }
    return {
      title: '邻里互助，便捷生活！',
      path: '/pages/services/index'
    };
  }
});
