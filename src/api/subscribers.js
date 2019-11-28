import resource from 'resource-router-middleware';
import subscriberModel from '../models/subscriberModel';
import jwt from 'jsonwebtoken'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id: 'subscriber',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		console.log('load::', id)
		subscriberModel.findOne({ _id: id }, function (error, subscriber) {
			callback(error, subscriber);
		});

	},


	/** GET / - List all entities */
	index(request, response) {
		jwt.verify(request.headers['authorization'], config.jwtSecret, (err, decoded) => {
			if (err) return response.status(401).json({ message: 'Not found' })
			else {

				subscriberModel.find().exec().then(result => {
					response.send(result)
				}).then(err => {
					response.status(500).send(err)
				});
			}
		})
	},

	/** POST / - Create a new entity */
	create({ body }, response) {
		console.log('body', body)
		var subscriber = new subscriberModel(body)
		subscriber.save().then(result => {
			response.send(result)
		}).catch(err => {
			console.log('err', err)
			response.status(500).send(err)
		})
	},

	/** GET /:id - Return a given entity */
	read(request, response) {
		jwt.verify(request.headers['authorization'], config.jwtSecret, (err, decoded) => {
			if (err) return response.status(401).json({ message: 'Not found' })
			else {
				console.log(' GET /:id', request.subscriber)
				response.json(request.subscriber);
			}
		})
	},

	/** PUT /:id - Update a given entity */
	update({ subscriber, body, headers }, response) {
		jwt.verify(headers['authorization'], config.jwtSecret, (err, decoded) => {
			if (err) return response.status(401).json({ message: 'Not found' })
			else {
				for (let key in body) {
					if (key !== 'id') {
						subscriber[key] = body[key];
					}
				}
				response.sendStatus(204);
			}
		})
	},

	/** DELETE /:id - Delete a given entity */
	delete({ subscriber, headers }, response) {
		jwt.verify(headers['authorization'], config.jwtSecret, (err, decoded) => {
			if (err) return response.status(401).json({ message: 'Not found' })
			else {
				subscriberModel.splice(subscriberModel.indexOf(subscriber), 1);
				response.sendStatus(204);
			}
		})
	}
});
