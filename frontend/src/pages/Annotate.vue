<template>
  <div class="annotation-container">
    <h2>Annotation</h2>
    <div class="index-info">Text {{ index }} / 400</div>

    <div class="text-block">
      <p v-html="currentText.replace(/\n/g, '<br>')"></p>
    </div>

    <div class="form-section">
      <select v-model="classification">
        <option value="">Select</option>
        <option value="Human">Human</option>
        <option value="LLM">LLM</option>
        <option value="Undecided">Undecided</option>
      </select>
      <textarea v-model="explanation" placeholder="Explanation"></textarea>
    </div>

    <div class="control-buttons">
      <button class="left-button" @click="prev">← Previous</button>
      <div class="center-jump">
        <input v-model.number="jumpId" type="number" min="1" max="400" />
        <button @click="jump">Go</button>
      </div>
      <button class="right-button" @click="next">Next →</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const index = ref(1)
const currentText = ref('')
const classification = ref('')
const explanation = ref('')
const jumpId = ref(null)
const username = localStorage.getItem('username')

function load(id) {
  fetch(`/api/text/${id}`, {
    headers: { 'x-user': username }
  })
    .then(res => res.json())
    .then(data => {
      currentText.value = data.text
      classification.value = data.classification || ''
      explanation.value = data.explanation || ''
    })
}

function save() {
  fetch(`/api/annotate/${index.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user': username
    },
    body: JSON.stringify({
      classification: classification.value,
      explanation: explanation.value
    })
  })
}

function prev() {
  if (index.value > 1) {
    save()
    index.value -= 1
    load(index.value)
  }
}

function next() {
  if (index.value < 400) {
    save()
    index.value += 1
    load(index.value)
  }
}

function jump() {
  if (jumpId.value >= 1 && jumpId.value <= 400) {
    save()
    index.value = jumpId.value
    load(index.value)
  }
}

onMounted(() => {
  load(index.value)
})
</script>

<style scoped>
.annotation-container {
  max-width: 800px;
  margin: auto;
  font-family: sans-serif;
}

.index-info {
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}

.text-block {
  padding: 15px;
  background: #f2f2f2;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

select, textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
}
textarea {
  height: 100px;
}

.control-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.left-button,
.right-button {
  padding: 8px 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.center-jump {
  display: flex;
  gap: 8px;
  align-items: center;
}

.center-jump input {
  width: 60px;
  padding: 6px;
}

.center-jump button {
  padding: 6px 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
