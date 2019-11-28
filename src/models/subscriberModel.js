import subscriberSchema from '../schemas/subscriberSchema'
import mongoose from 'mongoose'

const Subscriber = mongoose.model('subscriber', subscriberSchema)

export default Subscriber

