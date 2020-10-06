const { sanitizeEntity } = require('strapi-utils')

const sanitizeLesson = (lesson, ctx) => {
	if (!lesson.published_at) return

	const role = ctx.state.user && ctx.state.user.role.type

	const sanitizedEntity = sanitizeEntity(lesson, {
		model: strapi.models.lesson,
	})

	if (role !== 'student' && role !== 'advanced' && sanitizedEntity.private) {
		delete sanitizedEntity.videoId
	}

	if (sanitizedEntity.exercises) {
		sanitizedEntity.exercises = sanitizedEntity.exercises.filter(
			item => item.published_at
		)
	}

	if (sanitizedEntity.materials) {
		sanitizedEntity.materials = sanitizedEntity.materials.filter(
			item => item.published_at
		)
	}

	return sanitizedEntity
}

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
