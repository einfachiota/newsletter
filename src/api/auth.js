import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import Admin from '../models/adminModel'
import passport from 'passport'
import config from '../config'

const auth = Router()

auth.get('/info', passport.authenticate('jwt') , (req, res) => {
	jwt.verify(req.headers['authorization'], config.jwtSecret, (err, decoded) => {
		if (err) return res.status(401).json({ message: 'Not found' })
		else return res.status(200).json({ message: 'Ok', user: decoded })
	})
})


auth.post('/login', (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({ message: 'Missing required fields' })
	}
	Admin.findOne({ username: req.body.username })
	.then(user => {
		if(!user) return res.status(400).json({ message: 'No user' })
		bcrypt.compare(req.body.password, user.password, (err, result) => {
			if(result) {
				const token = jwt.sign({id: req.body.username},  config.jwtSecret)
				return res.status(200).json({ message: 'ok', token })
			}
			else {
				return res.status(400).json({ message: 'Bad password' })
			}
		})
	})
	.catch((err) => {
		return res.status(400).json(err)
	})
})

auth.post('/register', (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({ message: 'Missing required fields' })
	}

  findUser(req.body.username)
  .then(() => {
    let user = new Admin({ username: req.body.username, password: req.body.password })
    user.save()
    .then(() => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })
  .catch((err) => {
    res.status(400).json({ message: err.message })
  })
})

auth.get('/isLogged', (req, res) => {
  jwt.verify(req.headers['authorization'], config.jwtSecret, (err, decoded) => {
    if(err) return res.status(401).json({ message: 'Not logged', isLogged: false })
    else return res.status(200).json({ message: 'Logged' , isLogged: true })
  })
})

let findUser = (username) => {
  return Admin.findOne({ username })
	.then(user => {
		if(user) throw new Error('User already exists')
	})
	.catch((err) => {
    throw new Error(err.message)
  })
}

export default auth
