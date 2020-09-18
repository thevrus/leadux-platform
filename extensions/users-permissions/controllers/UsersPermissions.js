'use strict'
const { sanitizeEntity } = require('strapi-utils')

/**
 * UsersPermissions.js controller
 *
 * @description: A set of functions called "actions" of the `users-permissions` plugin.
 */

module.exports = {
	/**
	 * Default action.
	 *
	 * @return {Object}
	 */
	async setStudent(ctx) {
		const { user } = ctx.state

		console.log(ctx.body)

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'No authorization header was found' }] },
			])
		}

		if (!ctx.request.body) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'Request body is empty' }] },
			])
		}

		const { order_id, transaction_id, paytype } = ctx.request.body.data

		if (!order_id && !transaction_id && !paytype) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'Something went wrong' }] },
			])
		}

		const role = await strapi
			.query('role', 'users-permissions')
			.findOne({ type: 'student' }, [])

		if (role && user) {
			strapi.query('user', 'users-permissions').update(
				{ id: user.id },
				{
					role,
					orderID: order_id.toString(),
					transactionID: transaction_id.toString(),
					paymentService: paytype.toString(),
				}
			)
		}

		const sanitizeUser = user => {
			sanitizeEntity(user, {
				model: strapi.query('user', 'users-permissions').model,
			})
		}

		let data = await strapi.plugins[
			'users-permissions'
		].services.user.fetch({ id: user.id })

		if (data) data = sanitizeUser(data)

		// @TODO
		// * Send confirmational email

		// Send 200 `ok`
		ctx.body = data
	},
}
