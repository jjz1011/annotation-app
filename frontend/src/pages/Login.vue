<template>
  <div class="login-container">
    <h1>Text Annotation Platform</h1>
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="login">Login</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

function login() {
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('username', username.value)
        if (username.value === 'userp') {
          router.push('/admin')
        } else {
          router.push('/annotate')
        }
      } else {
        alert('Invalid credentials')
      }
    })
}
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
  font-family: sans-serif;
}
input {
  display: block;
  width: 100%;
  padding: 8px;
  margin: 10px auto;
  box-sizing: border-box;
}
button {
  padding: 8px 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
