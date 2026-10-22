import DefaultTheme from 'vitepress/theme'
import './style.css'
import Layout from './Layout.vue'

import DownloadBox from './components/DownloadBox.vue'
import StepGuide from './components/StepGuide.vue'
import ScenarioCards from './components/ScenarioCards.vue'
import FeatureShowcase from './components/FeatureShowcase.vue'
import HomeView from './components/HomeView.vue'
import ChangelogList from './components/ChangelogList.vue'
import { trackPageView } from './tracker'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('DownloadBox', DownloadBox)
    app.component('StepGuide', StepGuide)
    app.component('ScenarioCards', ScenarioCards)
    app.component('FeatureShowcase', FeatureShowcase)
    app.component('HomeView', HomeView)
    app.component('ChangelogList', ChangelogList)

    if (typeof window !== 'undefined' && router) {
      // 路由切换统一上报（包含首屏与后续路由跳转）
      const originalOnAfterRouteChanged = router.onAfterRouteChanged
      router.onAfterRouteChanged = (to: string) => {
        if (typeof originalOnAfterRouteChanged === 'function') {
          originalOnAfterRouteChanged(to)
        }
        trackPageView(to)
      }
    }
  }
}


