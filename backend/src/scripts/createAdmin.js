require('dotenv').config()
const bcrypt = require('bcryptjs')
const { connectDB } = require('../config/db')
const User = require('../models/User')

async function run() {
  const name = process.env.ADMIN_NAME || 'Admin'
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before running this script.')
    process.exit(1)
  }
  await connectDB()
  let user = await User.findOne({ email })
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10)
    user = await User.create({ name, email, passwordHash, isEmailVerified: true, role: 'admin', referralCode: Math.random().toString(36).slice(2,10) })
    console.log(`Created admin user ${email}`)
  } else {
    user.name = name
    user.passwordHash = await bcrypt.hash(password, 10)
    user.role = 'admin'
    user.isEmailVerified = true
    await user.save()
    console.log(`Updated existing user to admin: ${email}`)
  }
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })

