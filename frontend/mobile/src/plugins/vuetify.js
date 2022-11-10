import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import de from 'vuetify/es5/locale/de'
import { Touch } from 'vuetify/lib/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify, {
  directives: {
    Touch
  }
})

export default new Vuetify({
  lang: {
    locales: { de },
    current: 'de'
  },
  icons: {
    iconfont: 'md'
  },
  theme: {
    themes: {
      dark: {
        primary: '#928cff'
      }
    }
  }
})
