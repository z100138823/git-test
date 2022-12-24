import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

Vue.use(VueRouter)

//此为固定路由
const routes = [
  // {
  //   path: '/',
  //   name: 'manage',
  //   component: () => import( '../views/ManageView.vue'),
  //   redirect:"/home",
  //   children: [
  //     {path: 'home', name: '首页', component: () => import('../views/HomeView.vue')},
  //     {path: 'user', name: '用户管理', component: () => import('../views/UserView.vue')},
  //     {path: 'role', name: '角色管理', component: () => import('../views/RoleView.vue')},
  //     {path: 'menu', name: '菜单管理', component: () => import('../views/MenuView.vue')},
  //     {path: 'person', name: '个人信息', component: () => import('../views/PersonView.vue')},
  //     {path: 'file', name: '文件管理', component: () => import('../views/FileView.vue')},
  //
  //   ]
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404View.vue')
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/frontdesk/FrontPage.vue'),
    children: [
      {
        path:'home',
        name:'FrontHome',
        component: () => import('../views/frontdesk/HomePage.vue'),
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('../views/frontdesk/MessagePage.vue'),
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('../views/frontdesk/VideoPage.vue'),
      },
      {
        path: 'videoPlay',
        name: 'VideoPlay',
        component: () => import('../views/frontdesk/VideoPlayPage.vue'),
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('../views/frontdesk/CommentPage.vue'),
      },
      {
        path: 'commentShow',
        name: 'CommentShow',
        component: () => import('../views/frontdesk/CommentShowPage.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes//固定路由
})

//重置路由
export const resetRouter=()=>{
  router.matcher=new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes//固定路由
  })
}

//动态路由需要暴露接口显示不同界面
//刷新路由会重置路由
//其他路由需要动态设置
export const setRoutes= () => {
  const storeMenus = localStorage.getItem("menus");//缓存中取出集合
  if(storeMenus){
    //拼装动态路由
    const manageRoute= {path:'/',name:'ManageView', component:()=> import('../views/ManageView.vue'),redirect:"/home",children:[
        {path: 'person', name: '个人信息', component: () => import('../views/PersonView.vue')}
      ]}
    const menus= JSON.parse(storeMenus)
    menus.forEach(item =>{//动态
      if(item.path){//path不为空设置路由--只有一级路由
        let itemMenu={path:item.path.replace("/",""),name:item.name,component:()=> import('../views/'+item.pagePath+'View.vue')}//replace去掉斜杠成路径
        manageRoute.children.push(itemMenu)
      }else if(item.children.length){//判断有无二级路由
        item.children.forEach(item=>{
          if(item.path){//二级路由存在则设置
            let itemMenu={path:item.path.replace("/",""),name:item.name,component:()=> import('../views/'+item.pagePath+'View.vue')}
            manageRoute.children.push(itemMenu)
          }
        })
      }
    })

    //获取当前路由对象名称数组--防止重复添加路由对象
    const currentRouteNames=router.getRoutes().map(v=>v.name)
    if(!currentRouteNames.includes('ManageView')){
      //动态添加到现在的路由对象中去
      router.addRoute(manageRoute)
    }
  }
}

//重新加载防止重置路由
setRoutes()

// 路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称，为了在Header组件中去使用
  store.commit("setPath")  // 触发store的数据更新

  //未找到路由的情况
  if(!to.matched.length){
    const storeMenus=localStorage.getItem("menus")
    if(storeMenus){//没找到页面已登录，则跳转到404
      next("/404")
    }else{//没找到路由并且没登录到登录页
      next("/login")
    }
  }

  next()  // 放行路由
})

export default router
