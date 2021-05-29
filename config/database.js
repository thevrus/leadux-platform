const devConnection = function (env) {
	return {
		default: {
			connector: 'bookshelf',
			settings: {
				client: 'sqlite',
				filename: env('DATABASE_FILENAME', '.tmp/data.db'),
			},
			options: {
				useNullAsDefault: true,
			},
		},
	}
}

const prodConnection = function (env) {
	const parse = require('pg-connection-string').parse
	const config = parse(process.env.DATABASE_URL)

	return {
		default: {
			connector: 'bookshelf',
			settings: {
				client: 'postgres',
				host: config.host,
				port: config.port,
				database: config.database,
				username: config.user,
				password: config.password,
				ssl: {
					rejectUnauthorized: false,
				},
			},
			options: {
				ssl: true,
			},
		},
	}
}

module.exports = ({ env }) => ({
	defaultConnection: 'default',
	connections:
		env('MODE') === 'development'
			? devConnection(env)
			: prodConnection(env),
})
