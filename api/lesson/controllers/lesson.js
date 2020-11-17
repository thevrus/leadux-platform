'use strict'
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

module.exports = {
	async question(ctx) {
		const user = ctx.state.user

		if (!user) {
			return ctx.badRequest(null, [
				{
					messages: [{ id: 'You have sign in first to ask.' }],
				},
			])
		}

		if (Object.keys(ctx.request.body).length === 0) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'Request body is empty' }] },
			])
		}

		let entity

		if (ctx.is('multipart')) {
			const { data, files } = parseMultipartData(ctx)
			entity = await strapi.services.question.create(data, { files })
		} else {
			ctx.request.body.author = user
			ctx.request.body.lesson = ctx.params.id
			entity = await strapi.services.question.create(ctx.request.body)
		}

		return sanitizeEntity(entity, { model: strapi.models.question })
	},
}
