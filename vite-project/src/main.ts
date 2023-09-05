import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import io from "socket.io-client";

const socket1 = io("");
const socket2 = io("/hoge");

console.log({
    socket1,
    socket2
});

socket2.on('message', (message: string): void => {
    console.log(`socket2 [/hoge] ${message}`);
})

socket1.on('message', (message: string): void => {
    console.log(`socket1 [/hoge] ${message}`);
})

createApp(App).mount('#app')
