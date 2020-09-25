const { sanitizeEntity } = require('strapi-utils')
const { sanitizeLesson } = require('../../../helpers/helpers')

module.exports = {
	async find(ctx) {
		let entities

		if (ctx.query._q) {
			entities = await strapi.services.playlist.search(ctx.query)
		} else {
			entities = await strapi.services.playlist.find(ctx.query)
		}

		return entities.map(entity => {
			const sanitizedEntity = sanitizeEntity(entity, {
				model: strapi.models.playlist,
			})

			sanitizedEntity.lessons = sanitizedEntity.lessons.map(entity =>
				sanitizeLesson(entity, ctx)
			)

			return sanitizedEntity
		})
	},
}
