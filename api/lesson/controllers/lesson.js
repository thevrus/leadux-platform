'use strict'
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')
const { sanitizeLesson } = require('../../../helpers/helpers')

module.exports = {
	async find(ctx) {
		let entities

		const filters = ctx.query

		filters.published = true

		if (ctx.query._q) {
			entities = await strapi.services.lesson.search(filters)
		} else {
			entities = await strapi.services.lesson.find(filters)
		}

		return entities.map(entity => sanitizeLesson(entity, ctx))
	},
	async comment(ctx) {
		const user = ctx.state.user

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'You have sign in first to comment.' }] },
			])
		}

		let entity

		// TODO
		// * Support images/files
		if (ctx.is('multipart')) {
			const { data, files } = parseMultipartData(ctx)
			entity = await strapi.services.comment.create(data, { files })
		} else {
			ctx.request.body.user = user
			ctx.request.body.lesson = ctx.params.id
			entity = await strapi.services.comment.create(ctx.request.body)
		}

		return sanitizeEntity(entity, { model: strapi.models.comment })
	},
}
