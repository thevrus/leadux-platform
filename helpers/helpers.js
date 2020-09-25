const { sanitizeEntity } = require('strapi-utils')

/**
 * Return lessons based on user's access level
 *
 * @return {Array}
 */
const sanitizeLesson = (lesson, ctx) => {
	const role = ctx.state.user && ctx.state.user.role.type

	const sanitizedEntity = sanitizeEntity(lesson, {
		model: strapi.models.lesson,
	})

	if (role !== 'student' && role !== 'advanced' && sanitizedEntity.private) {
		delete sanitizedEntity.videoId
		delete sanitizedEntity.videoLength
	}

	if (sanitizedEntity.exercises) {
		sanitizedEntity.exercises = sanitizedEntity.exercises.filter(
			item => item.published
		)
	}

	if (sanitizedEntity.materials) {
		sanitizedEntity.materials = sanitizedEntity.materials.filter(
			item => item.published
		)
	}

	return sanitizedEntity
}

module.exports = {
	sanitizeLesson,
}
