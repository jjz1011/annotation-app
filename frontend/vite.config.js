import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 你的 GitHub 用户名和仓库名
const repoName = 'jjz1011/annotation-app' // ⚠️ 替换成你的仓库名

export default defineConfig({
  plugins: [vue()],
  base: `/${repoName}/`, // GitHub Pages 部署时的根路径
  build: {
    outDir: 'dist'
  }
})

