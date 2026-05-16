const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.static(path.join(__dirname)))

app.post('/api/auth/verify', async (req, res) => {
  const { accessToken } = req.body
  if (!accessToken) {
    return res.status(400).json({ valid: false, error: 'Missing accessToken' })
  }
  try {
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    if (!response.ok) {
      const text = await response.text()
      return res.status(401).json({ valid: false, error: `Pi API rejected token: ${response.status} ${text}` })
    }
    const data = await response.json()
    res.json({ valid: true, user: data })
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
