// pages/groupdetail/index.js
Page({
  data: {
    groupId: null,
    groupName: '',
    posts: [],
    userLoggedIn: false, // Assume we can check if the user is logged in
    userId: null, // Assume we have the current user's ID
    isGroupMember: false, // Is the current user a member of this group?
    showPostModal: false,
    newPostContent: '',
    // Mock user data for post authors, including credit scores
    // In a real app, this would be fetched by joining Posts with Users table
    usersData: {
      'user1': { nickname: '张三', neighborhoodCreditScore: 95, avatarUrl: '/assets/mock_avatar_1.png' },
      'user2': { nickname: '李四', neighborhoodCreditScore: 110, avatarUrl: '/assets/mock_avatar_2.png' },
      'user3': { nickname: '王五', neighborhoodCreditScore: 75, avatarUrl: '/assets/mock_avatar_3.png' },
      'mockUserId123': { nickname: '我 (小明)', neighborhoodCreditScore: 100, avatarUrl: '/assets/mock_avatar_4.png' } // Current user
    }
  },

  onLoad: function (options) {
    this.setData({
      groupId: options.groupId,
      groupName: decodeURIComponent(options.groupName || '群组详情')
    });
    wx.setNavigationBarTitle({ title: this.data.groupName });

    // Simulate checking user login status and membership
    const app = getApp();
    if (app.globalData && app.globalData.userInfo && app.globalData.userId) {
      this.setData({
        userLoggedIn: true,
        userId: app.globalData.userId
      });
    } else {
      // For mock purposes, assume user is logged in after a delay
      setTimeout(() => {
        this.setData({ userLoggedIn: true, userId: 'mockUserId123' });
        this.checkMembership(); // Check membership after "login"
      }, 500);
    }
    
    this.fetchPosts();
    this.checkMembership(); // Initial check, might be re-checked if login status changes
  },

  fetchPosts: function () {
    wx.showLoading({ title: '加载帖子...' });
    // Simulate API call to get posts for this.data.groupId
    setTimeout(() => {
      const mockPosts = [
        { postId: 'post1', groupId: this.data.groupId, userId: 'user1', content: '今天天气真好，有人一起去公园散步吗？', createdAt: '2023-10-28 10:00', commentCount: 5, imageUrls: ['/assets/sample_image_1.jpg'] },
        { postId: 'post2', groupId: this.data.groupId, userId: 'user2', content: '楼下的便利店新到一批进口零食，推荐大家去尝尝！味道非常不错，价格也公道。', createdAt: '2023-10-28 11:30', commentCount: 12, imageUrls: [] },
        { postId: 'post3', groupId: this.data.groupId, userId: 'user1', content: '谁家有闲置的婴儿车？宝宝大了用不上了，想转让或借用一段时间。', createdAt: '2023-10-28 14:15', commentCount: 3, imageUrls: [] },
        { postId: 'post4', groupId: this.data.groupId, userId: 'user3', content: '小区篮球场晚上有人组队吗？求带，技术一般但热情高涨！', createdAt: '2023-10-27 19:30', commentCount: 8, imageUrls: ['/assets/sample_image_2.jpg', '/assets/sample_image_3.jpg'] }
      ];
      // Filter posts that "belong" to the current group for simulation
      const groupPosts = mockPosts.filter(post => post.groupId === this.data.groupId || this.data.groupId.startsWith('group')); // Loosen for mock
      
      // Format createdAt for display (simple version)
      const formattedPosts = groupPosts.map(post => {
        return {
          ...post,
          // In a real app, ensure createdAt is a Date object or parseable string
          // displayTime: new Date(post.createdAt).toLocaleString() // More complex formatting might be needed
          displayTime: post.createdAt // Keep it simple for now
        };
      });

      this.setData({ posts: formattedPosts });
      wx.hideLoading();
    }, 1000);
  },

  checkMembership: function() {
    // Simulate checking if the current user is a member of this.data.groupId
    // In a real app, you'd check against the GroupMembers table or a global state
    if (this.data.userId && this.data.groupId) {
      // Let's assume user 'mockUserId123' is a member of 'group1' and 'group3' for testing
      const joinedGroups = getApp().globalData.mockUserJoinedGroups || { 'group1': true, 'group3': true }; // Get from app global or community page's state
      if (joinedGroups[this.data.groupId]) {
        this.setData({ isGroupMember: true });
      } else {
        this.setData({ isGroupMember: false });
      }
      console.log(`User ${this.data.userId} membership in ${this.data.groupId}: ${this.data.isGroupMember}`);
    }
  },

  showCreatePostModal: function() {
    if (!this.data.isGroupMember) {
      wx.showToast({ title: '请先加入群组才能发帖', icon: 'none' });
      return;
    }
    this.setData({ showPostModal: true });
  },

  hidePostModal: function() {
    this.setData({ showPostModal: false, newPostContent: '' });
  },

  handlePostInput: function(e) {
    this.setData({ newPostContent: e.detail.value });
  },

  submitPost: function() {
    if (this.data.newPostContent.trim() === '') {
      wx.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '发布中...' });
    // Simulate API call to create post
    setTimeout(() => {
      const newPost = {
        postId: 'post' + Date.now(), // Mock new post ID
        groupId: this.data.groupId,
        userId: this.data.userId, // Current logged-in user
        content: this.data.newPostContent,
        createdAt: new Date().toLocaleString().split(',')[0], // Simple date
        commentCount: 0,
        imageUrls: [] // Image upload not implemented in this step
      };
      this.setData({
        posts: [newPost, ...this.data.posts], // Add new post to the top
        showPostModal: false,
        newPostContent: ''
      });
      wx.hideLoading();
      wx.showToast({ title: '发布成功!', icon: 'success' });
    }, 1000);
  },

  handleViewComments: function(e) {
    const postId = e.currentTarget.dataset.postid;
    const postTitle = this.data.posts.find(p => p.postId === postId)?.content.substring(0, 20) + '...';
    // For now, just show a modal. Later, navigate to a comment page or expand inline.
    wx.showModal({
      title: '查看评论',
      content: `评论功能正在开发中，敬请期待对帖子 "${postTitle}" 的评论。`,
      showCancel: false,
      confirmText: '知道了'
    });
    // wx.navigateTo({ url: `/pages/comments/index?postId=${postId}` });
  },
  
  // Pull down to refresh
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.fetchPosts();
    // Optionally re-check membership if relevant
    // this.checkMembership(); 
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500);
  },

  // Placeholder for image assets if needed by WXML directly, or use absolute paths
  // This is more for if you were directly referencing them in WXML outside of a dynamic list
  // For dynamic lists, ensure paths are correct in the data.
  // data: {
  //   sampleImage1: '/assets/sample_image_1.jpg', // Example
  // }
});

// Helper to get app instance, useful if not already available in `this` context sometimes
// function getAppInstance() {
//   return getApp();
// }
