import Vue from 'vue'
import Vuex from 'vuex'
import router, {resetRouter} from "@/router";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        currentPathName: ''
    },
    mutations: {
        setPath (state) {
            state.currentPathName = localStorage.getItem("currentPathName")
        },
        logout(){
            //清空缓存
            localStorage.removeItem("menus")
            localStorage.removeItem("user")
            router.push("/login")

            //重置路由--防止新添加的路由无法404
            resetRouter()
        }
    }
})

export default store