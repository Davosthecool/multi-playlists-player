import { createApp } from 'vue'
import './style.css'
import App from './views/App.vue'
import Connection from './views/Connection.vue'

const connected: boolean = false

if (connected) {
    createApp(App).mount('#app')
} else {
    createApp(Connection).mount('#app')
}

