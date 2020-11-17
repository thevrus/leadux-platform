'use strict'

let crypto = require('crypto')

module.exports = ({ env }) => ({
	host_url: env('HOST_URL'),
	client_url: env('CLIENT_URL'),
	public_key: env('LP_PUBLIC_KEY'),

	data_signature: function (params) {
		params = this.cnb_params(params)
		const data = new Buffer.from(JSON.stringify(params)).toString('base64')
		return {
			data,
			signature: this.str_to_sign(
				env('LP_PRIVATE_KEY') + data + env('LP_PRIVATE_KEY')
			),
		}
	},

	signature: function (data) {
		return this.str_to_sign(
			env('LP_PRIVATE_KEY') + data + env('LP_PRIVATE_KEY')
		)
	},

	str_to_sign: function (str) {
		const sha1 = crypto.createHash('sha1')
		sha1.update(str)
		return sha1.digest('base64')
	},

	cnb_params: function (params) {
		params.public_key = env('LP_PUBLIC_KEY')

		if (!params.version) throw new Error('version is null')
		if (!params.amount) throw new Error('amount is null')
		if (!params.currency) throw new Error('currency is null')
		if (!params.description) throw new Error('description is null')

		return params
	},

	decode_base64: function (string) {
		const data = new Buffer.from(string, 'base64').toString('utf-8')

		return data
	},
})
