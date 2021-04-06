<template>
  <div id="app">
    <el-radio-group v-model="lang" @change="changeHandle">
      <el-radio-button label="zh-CN">CN 简体中文</el-radio-button>
      <el-radio-button label="en-US">US English</el-radio-button>
    </el-radio-group>
    <div id="nav">
      <router-link to="/">{{ $t('home') }}</router-link> |
      <router-link to="/about">{{ $t('about.tit') }}</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { loadLanguageAsync } from '@/locales'
  export default {
    data(){
      return {
        lang: 'zh-CN'
      }
    },
    methods: {
      changeHandle(val) {
        loadLanguageAsync(val)
      }
    }
  }
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
