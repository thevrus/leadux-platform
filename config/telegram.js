'use strict'

const fetch = require('node-fetch')

module.exports = ({ env }) => ({
	notify: function (transaction) {
		if (!transaction) return

		const {
			status,
			currency,
			amount,
			description,
			sender_card_country,
			transaction_id,
			user,
		} = transaction

		const text = `💸 <i>New Payment</i> 💸 \n
Username: <b>${user.username}</b>\n
Email: <b>${user.email}</b>\n
Status: <b>${status}</b>\n
Currency: <b>${currency}</b>\n
Amount: <b>${amount}</b>\n
Description: <b>${description}</b>\n
Sender Country: <b>${sender_card_country}</b>\n
Transaction ID: <b>${transaction_id}</b>\n`

		const URI = encodeURI(
			`https://api.telegram.org/bot${env(
				'BOT_TOKEN'
			)}/sendMessage?chat_id=${env(
				'CHAT_ID'
			)}&parse_mode=html&text=${text}`
		)

		fetch(URI, { method: 'POST' })
	},
})
