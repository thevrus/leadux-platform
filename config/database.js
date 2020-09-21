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
	return {
		default: {
			connector: 'mongoose',
			settings: {
				host: env('DATABASE_HOST'),
				srv: env.bool('DATABASE_SRV'),
				port: env.int('DATABASE_PORT'),
				database: env('DATABASE_NAME'),
				username: env('DATABASE_USERNAME'),
				password: env('DATABASE_PASSWORD'),
			},
			options: {
				authenticationDatabase: env('AUTHENTICATION_DATABASE', null),
				ssl: env.bool('DATABASE_SSL', true),
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
