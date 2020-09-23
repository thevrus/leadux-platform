'use strict'

const { sanitizeEntity, parseMultipartData } = require('strapi-utils')

module.exports = {
	async find(ctx) {
		const role = ctx.state.user && ctx.state.user.role.type

		let entities = []

		const filters = ctx.query

		filters.published = true

		if (ctx.query._q) {
			entities = await strapi.services.lesson.search(filters)
		} else {
			entities = await strapi.services.lesson.find(filters)
		}

		const sanitizeContent = content => {
			const sanitizedEntity = sanitizeEntity(content, {
				model: strapi.models.lesson,
			})

			if (
				role !== 'student' &&
				role !== 'advanced' &&
				sanitizedEntity.private
			) {
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

		return entities.map(entity => sanitizeContent(entity))
	},
	async comment(ctx) {
		const user = ctx.state.user

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'You have to sign in first to comment.' }] },
			])
		}

		let entity

		// @TODO
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
