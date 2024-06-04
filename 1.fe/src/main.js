import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Mixin from './mixins'

const app = createApp(App)

app.use(store)
app.use(router)
app.mixin(Mixin)
app.mount('#app')
