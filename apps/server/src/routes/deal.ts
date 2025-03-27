import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { CreateDealRequest, CreateDealTokenRequest, DealSchemas } from '../models/deal'
import { prisma } from '../utils/prismaClient'
import { DealStatus } from '@prisma/client'

const createDeal = async (
	request: FastifyRequest<{ Body: CreateDealRequest }>,
	reply: FastifyReply
) => {
	const { name, description, allocationRub, allocationEth } = request.body

	const deal = await prisma.deal.create({
		data: {
			name,
			description,
			allocationRub,
			allocationEth,
			status: DealStatus.draft
		}
	})

	return reply.status(201).send(deal)
}

const createDealToken = async (
	request: FastifyRequest<{ Body: CreateDealTokenRequest }>,
	reply: FastifyReply
) => {
	const { dealId, tokenId, tokenAmount } = request.body

	const dealToken = await prisma.dealToken.create({
		data: {
			dealId,
			tokenId,
			tokenAmount,
			tokenAddress: '0x0'
		}
	})

	await prisma.deal.update({
		where: { id: dealId },
		data: {
			status: DealStatus.raising
		}
	})

	return reply.status(201).send(dealToken)
}

const getDeal = async (
	request: FastifyRequest<{ Params: { id: string } }>,
	reply: FastifyReply
) => {
	const { id } = request.params
	const deal = await prisma.deal.findUnique({
		where: { id },
		include: {
			dealToken: true
		}
	})

	if (!deal) {
		return reply.status(404).send({ message: 'Deal not found' })
	}

	return { ...deal.dealToken, deal }
}

export const dealRoutes = (app: FastifyInstance) => {
	app.post('/deal', { schema: DealSchemas.createDeal, preHandler: [app.admin] }, createDeal)
	app.post(
		'/deal/token',
		{ schema: DealSchemas.createDealToken, preHandler: [app.admin] },
		createDealToken
	)
	app.get('/deal/:id', { schema: DealSchemas.getDeal }, getDeal)
	app.get('/deals', async () => {
		const deals = await prisma.deal.findMany()
		return { deals }
	})
}
