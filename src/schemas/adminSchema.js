import { Schema } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const adminSchema = new Schema({
  username: { type: String, minlength: [4, 'Username must be longer than 3 character']},
  password: { type: String, minlength: [4, 'Password must be longer than 3 character']},
})

adminSchema.pre('save', function(next) {
  let user = this
  let saltRounds = 5

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)
      user.password = hash;
      next()
    })
  })
})

export default adminSchema
