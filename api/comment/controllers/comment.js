'use strict'
const { sanitizeEntity, parseMultipartData } = require('strapi-utils')

module.exports = {
	async comment(ctx) {
		console.log('create fired')
		const user = ctx.state.user

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'You have to sign in first to comment.' }] },
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
