'use strict'

const liqpay = strapi.config.liqpay
const telegram = strapi.config.telegram

module.exports = {
	async setStudent(ctx) {
		if (Object.keys(ctx.request.body).length === 0) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'Request body is empty' }] },
			])
		}

		const POST_DATA = ctx.request.body.data
		const POST_SIGNATURE = ctx.request.body.signature

		if (liqpay.signature(POST_DATA) !== POST_SIGNATURE) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'Signature is invalid' }] },
			])
		}

		const {
			status,
			currency,
			amount,
			description,
			sender_card_country,
			order_id,
			payment_id,
			liqpay_order_id,
			transaction_id,
		} = JSON.parse(liqpay.decode_base64(ctx.request.body.data))

		if (status !== 'success') {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'Something went wrong' }] },
			])
		}

		const user = await strapi
			.query('user', 'users-permissions')
			.findOne({ id: ctx.request.query.user })

		const payment = await strapi.services.payment.create({
			currency,
			description,
			order_id,
			liqpay_order_id,
			user,
			amount: amount.toString(),
			sender_card_country: sender_card_country.toString(),
			payment_id: payment_id.toString(),
			transaction_id: transaction_id.toString(),
		})

		const plan = await strapi.query('plan').findOne({
			id: ctx.request.query.plan,
		})

		// type
		const role = await strapi
			.query('role', 'users-permissions')
			.findOne({ type: plan.role.type }, [])

		// Set new role
		strapi.query('user', 'users-permissions').update(
			{ id: ctx.request.query.user },
			{
				role,
				plan: ctx.request.query.plan,
				payment,
			}
		)

		await strapi.plugins['users-permissions'].services.user.fetch({
			id: ctx.request.query.user,
		})

		telegram.notify({
			status,
			currency,
			amount,
			description,
			sender_card_country,
			transaction_id,
			user,
		})

		// TODO
		// * Send confirmational email
		ctx.redirect(`${liqpay.client_url}watch`)
	},

	async getInvoice(ctx) {
		const { user } = ctx.state

		const allPlans = await strapi.services.plan.find({})
		// const userPlan = await strapi.query('plan').findOne({ id: user.plan })

		ctx.body = allPlans.map(plan => {
			let response

			if (user) {
				const result_url = user
					? `${liqpay.host_url}users-permissions/setstudent?user=${user.id}&plan=${plan.id}`
					: null

				const payment = {
					action: 'pay',
					amount: plan.usd,
					currency: 'USD',
					public_key: liqpay.public_key,
					description: plan.description,
					result_url,
					version: '3',
				}

				const { data, signature } = liqpay.data_signature(payment)

				response = {
					name: plan.name,
					description: plan.description,
					currency: 'USD',
					amount: plan.usd,
					pros: plan.pros,
					data,
					signature,
				}
			} else {
				response = {
					name: plan.name,
					description: plan.description,
					currency: 'USD',
					amount: plan.usd,
					pros: plan.pros,
				}
			}

			return response
		})
	},
}
