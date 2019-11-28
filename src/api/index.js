import { version } from '../../package.json';
import { Router } from 'express';
import auth from './auth'
import subscribers from './subscribers';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/auth', auth)
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.use('/subscribers', subscribers({ config, db }))

	return api;
}
