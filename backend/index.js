import express from 'express'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = 3000
app.use(cors())
app.use(bodyParser.json())

const users = ['usera', 'userb', 'userc', 'userd']
const admin = 'userp'

// ✅ 放置真实文本数据：直接从文件读取
const texts = JSON.parse(fs.readFileSync(path.join(__dirname, 'texts.json'), 'utf-8'))

function getDB(username) {
  if (!users.includes(username)) return null
  const dbPath = path.join(__dirname, `${username}.db`)
  return new sqlite3.Database(dbPath)
}

// ✅ 初始化所有数据库（仅首次运行时使用）
function initializeAllUserDatabases() {
  users.forEach(username => {
    const dbPath = path.join(__dirname, `${username}.db`)
    if (!fs.existsSync(dbPath)) {
      const db = new sqlite3.Database(dbPath)
      db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS annotations (id INTEGER PRIMARY KEY, classification TEXT, explanation TEXT)')
        for (let i = 1; i <= texts.length; i++) {
          db.run('INSERT INTO annotations (id, classification, explanation) VALUES (?, ?, ?)', [i, '', ''])
        }
      })
      db.close()
      console.log(`Initialized DB for ${username}`)
    }
  })
}

initializeAllUserDatabases()

// Serve frontend
app.use('/', express.static(path.join(__dirname, '../frontend/dist')))

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if ((users.includes(username) || username === admin) && password === username) {
    res.json({ success: true })
  } else {
    res.json({ success: false })
  }
})

app.get('/api/text/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const username = req.headers['x-user']
  const db = getDB(username)
  if (!db || isNaN(id) || id < 1 || id > texts.length) return res.status(403).send('Invalid user or text id')

  db.get('SELECT * FROM annotations WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).send('DB error')
    res.json({ text: texts[id - 1], classification: row.classification, explanation: row.explanation })
  })
})

app.post('/api/annotate/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { classification, explanation } = req.body
  const username = req.headers['x-user']
  const db = getDB(username)
  if (!db) return res.status(403).send('Invalid user')

  db.run('UPDATE annotations SET classification = ?, explanation = ? WHERE id = ?', [classification, explanation, id], err => {
    if (err) return res.status(500).send('Update error')
    res.sendStatus(200)
  })
})

app.get('/api/progress', (req, res) => {
  const result = []
  let pending = users.length
  users.forEach(u => {
    const db = getDB(u)
    db.get('SELECT COUNT(*) AS count FROM annotations WHERE classification != "" OR explanation != ""', (err, row) => {
      result.push({ user: u, count: row.count })
      pending--
      if (pending === 0) res.json(result)
    })
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
