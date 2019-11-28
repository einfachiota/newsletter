import { Schema } from 'mongoose'

const subscriberSchema = new Schema({
  first_name: {
    type: String,
    required: true, minlength: [2, 'First name must be longer than 1 character']
  },
  last_name: {
    type: String,
    required: true, minlength: [2, 'Last name must be longer than 1 character']
  },
  email: {
    type: String,
    required: true, minlength: [2, 'email must be longer than 1 character']
  }
})

subscriberSchema.pre('save', function (next) {
  let subscriber = this
  console.log('subscriber pre save')
  next()
})

export default subscriberSchema
