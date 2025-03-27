import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'

declare module 'fastify' {
	export interface FastifyInstance {
		admin: <T extends RouteGenericInterface = RouteGenericInterface>(
			request: FastifyRequest<T>,
			reply: FastifyReply
		) => Promise<void>
	}
}
