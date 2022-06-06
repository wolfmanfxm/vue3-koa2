<script >
import MenuTree from './MenuTree.vue'
import BreadCrumbs from './BreadCrumbs.vue'

export default {
  name: 'Home',
  components: {
    MenuTree, BreadCrumbs
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  },
  methods: {
    loginout(key) {
      if (key == 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    async getNoticeCount() {
      try {
        const res = await this.$api.noticeCount();
        this.noticeCount = res;
      } catch (err) {
        console.error(err)
      }
    },
    async getMenuList() {
      try {
        const res = await this.$api.menuList();
        this.userMenu = res;
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu :default-active="activeMenu" class="nav-menu" background-color="#001529" text-color="#fff" router
        :collapse="isCollapse">
        <menu-tree :userMenu="userMenu"/>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon>
              <fold />
            </el-icon>
          </div>
          <div class="bread">
            <BreadCrumbs />
          </div>
        </div>
        <div class="user">
          <el-badge :is-dot="noticeCount > 0" class="notice" type="danger">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown class="user-info" @command="loginout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="loginout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: white;
    overflow-y: auto;
    transition: width .5s;

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;

      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }

    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }

    &.fold {
      width: 64px;
    }

    &.unfold {
      width: 200px;
    }
  }

  .content-right {
    margin-left: 200px;

    &.fold {
      margin-left: 64px;
    }

    &.unfold {
      margin-left: 200px;
    }

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between; //两端对齐
      border-bottom: 1px solid #ddd;
      padding: 0 20px;

      .nav-left {
        display: flex;
        align-items: center;

        .menu-fold {
          font-size: 18px;
          margin-right: 15px;
        }
      }

      .user {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }

        .user-info {
          vertical-align: middle;
          height: 25px;

          .user-link {
            cursor: pointer;
            color: #409eff;
          }
        }
      }
    }

    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);

      .main-page {
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
