'use strict'
const { sanitizeEntity } = require('strapi-utils')

const liqpay = strapi.config.liqpay

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

		console.log(JSON.parse(liqpay.decode_base64(ctx.request.body.data)))

		if (status !== 'success') {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'Something went wrong' }] },
			])
		}

		const role = await strapi
			.query('role', 'users-permissions')
			.findOne({ type: 'student' }, [])

		strapi.query('user', 'users-permissions').update(
			{ id: ctx.request.query.id },
			{
				role,
				currency,
				amount,
				description,
				sender_card_country,
				order_id,
				payment_id,
				liqpay_order_id,
				transaction_id,
			}
		)

		await strapi.plugins['users-permissions'].services.user.fetch({
			id: ctx.request.query.id,
		})

		// TODO
		// * Send confirmational email
		ctx.redirect(`${ctx.request.header.referer}watch`)
	},

	async getInvoice(ctx) {
		const { user } = ctx.state

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'No authorization header was found' }] },
			])
		}

		// TODO
		// * Pass environment variable
		const result_url = `${liqpay.host_url}/users-permissions/setstudent?id=${user.id}`

		// TODO
		// * Prepare individual invoices
		// * Check if user has other plans
		// const { status, country, countryCode, currency } = ctx.request.body
		// console.log(ctx.request.body)

		const payment = {
			action: 'pay',
			amount: '1',
			currency: 'UAH',
			public_key: liqpay.public_key,
			description: 'Курс Figma',
			result_url,
			version: '3',
		}

		const { data, signature } = liqpay.data_signature(payment)

		ctx.body = {
			currency: payment.currency,
			amount: payment.amount,
			data,
			signature,
		}
	},
}
