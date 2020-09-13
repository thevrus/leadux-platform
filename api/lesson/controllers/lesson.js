'use strict'

const { sanitizeEntity } = require('strapi-utils')

module.exports = {
	async find(ctx) {
		const userRole = ctx.state.user ? ctx.state.user.role.type : 'new'

		let entities

		const filters = ctx.query

		filters.published = true

		if (ctx.query._q) {
			entities = await strapi.services.lesson.search(filters)
		} else {
			entities = await strapi.services.lesson.find(filters)
		}

		return entities.reduce((result, entity) => {
			let lesson = sanitizeEntity(entity, {
				model: strapi.models.lesson,
			})

			if (!entity.private) result.push(lesson)

			if (entity.private && userRole === 'student') {
				result.push(lesson)
			}

			result = result.map(less => {
				// Delete updated_by, created_by props

				delete less.updated_by
				delete less.created_by

				// Delete private exercises
				if (less.exercises) {
					less.exercises = less.exercises.map(exercise => {
						if (exercise.published) {
							delete exercise.updated_by
							delete exercise.created_by

							return exercise
						}
					})
				}

				// Delete private materials
				if (less.materials) {
					less.materials = less.materials.map(material => {
						if (material.published) {
							delete material.updated_by
							delete material.created_by

							return material
						}
					})
				}

				return less
			})

			return result
		}, [])
	},
}
