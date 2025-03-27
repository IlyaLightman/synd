import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import { dealRoutes } from './routes/deal'

const fastify = Fastify()

fastify.register(cors, {
	origin: '*'
})

fastify.register(swagger, {
	swagger: {
		info: {
			title: 'Synd',
			description: 'API documentation of Synd',
			version: '1.0.0'
		}
	}
})

fastify.decorate('admin', async (req: FastifyRequest, reply: FastifyReply) => {
	const signature = req.headers['admin-signature']
	console.log(req.headers)
	if (!signature) {
		return reply.status(403).send({ message: 'Forbidden' })
	}

	// veirfy message signing
})

fastify.register(dealRoutes, { prefix: '/api' })

fastify.get('/ping', async () => {
	return { message: 'pong' }
})

const start = async () => {
	try {
		await fastify.listen({ port: 3001 })
		console.log('Server is running at http://localhost:3001')
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
