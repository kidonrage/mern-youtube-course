const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth
router.post(
  '/register', 
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Password is invalid').isLength({ min: 6 })
  ],
  async (req,res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect registration data'
      })
    }

    const  {email, password} = req.body

    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(400).json({ message: 'User with this email is already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
      email,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: 'User created successfully' })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again' })
  }
})

router.post(
  '/login', 
  [
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Type in password').exists()
  ],
  async (req,res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect registration data'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'User with this email is not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('JWTSecret'),
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id })
})

module.exports = router