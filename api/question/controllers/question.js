'use strict'
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

module.exports = {
	async find(ctx) {
		let entities

		if (ctx.query._q) {
			entities = await strapi.services.question.search(ctx.query)
		} else {
			entities = await strapi.services.question.find(ctx.query)
		}

		entities = entities.filter(answer => answer.author !== null)

		entities = await Promise.all(
			entities.map(async entity => {
				entity.answers = await Promise.all(
					entity.answers.map(async answer => {
						answer.author = await strapi
							.query('user', 'users-permissions')
							.findOne({ id: answer.author })

						return answer
					})
				)

				return entity
			})
		)

		return entities.map(entity =>
			sanitizeEntity(entity, { model: strapi.models.question })
		)
	},

	async answer(ctx) {
		const user = ctx.state.user

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'You have sign in first to answer.' }] },
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
			entity = await strapi.services.answer.create(data, { files })
		} else {
			ctx.request.body.author = user
			ctx.request.body.question = ctx.params.id
			entity = await strapi.services.answer.create(ctx.request.body)
		}
		return sanitizeEntity(entity, { model: strapi.models.answer })
	},
}
