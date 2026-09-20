import DefaultTheme from 'vitepress/theme'
import './style.css'

import DownloadBox from './components/DownloadBox.vue'
import StepGuide from './components/StepGuide.vue'
import ScenarioCards from './components/ScenarioCards.vue'
import FeatureShowcase from './components/FeatureShowcase.vue'
import HomeView from './components/HomeView.vue'
import ChangelogList from './components/ChangelogList.vue'
import { trackPageView } from './tracker'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('DownloadBox', DownloadBox)
    app.component('StepGuide', StepGuide)
    app.component('ScenarioCards', ScenarioCards)
    app.component('FeatureShowcase', FeatureShowcase)
    app.component('HomeView', HomeView)
    app.component('ChangelogList', ChangelogList)

    if (typeof window !== 'undefined' && router) {
      // 首屏加载上报
      trackPageView()

      // 路由切换上报
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


