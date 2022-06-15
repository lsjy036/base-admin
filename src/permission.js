import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getCookie } from '@/utils/auth' 

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login','/register'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
    NProgress.start()
    let cookie = getCookie()
    if(cookie){
      next()
    }
    else{
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      }
      else{
        next('/login')
      }
    }
})
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})