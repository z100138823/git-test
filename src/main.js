import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/gloable.css'
import request from "@/utils/request";

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
// import VideoPlayer from 'vue-video-player'
// import 'vue-video-player/src/custom-theme.css'
// import 'video.js/dist/video-js.css'
//
// Vue.use(VideoPlayer)

// import VideoPlayer from 'vue-video-player'
//
// require('video.js/dist/video-js.css')
//
// require('vue-video-player/src/custom-theme.css')
//
// Vue.use(VideoPlayer)



Vue.config.productionTip = false
Vue.use(ElementUI,{size:"mini"});
Vue.prototype.request=request

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
