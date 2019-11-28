import adminSchema from '../schemas/adminSchema'
import mongoose from 'mongoose'

const Admin = mongoose.model('admin', adminSchema)


export default Admin
