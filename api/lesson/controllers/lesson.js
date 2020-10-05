'use strict'

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
}
