import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { CreateDealRequest, CreateDealTokenRequest, DealSchemas } from '../models/deal'
import { prisma } from '../utils/prismaClient'
import { DealStatus } from '@prisma/client'

const createDealHandler = async (
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

const createDealTokenHandler = async (
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

const updateDealStatus = async (id: string, status: DealStatus) => {
	const deal = await prisma.deal.findUnique({
		where: { id }
	})

	if (!deal) {
		throw new Error('Deal not found')
	}

	await prisma.deal.update({
		where: { id },
		data: {
			status
		}
	})

	return deal
}

const withdrawDealHandler = async (
	request: FastifyRequest<{ Params: { id: string } }>,
	reply: FastifyReply
) => {
	await updateDealStatus(request.params.id, DealStatus.invested)
	return reply.status(200).send({ message: 'Deal status updated successfully' })
}

const closeDealHandler = async (
	request: FastifyRequest<{ Params: { id: string } }>,
	reply: FastifyReply
) => {
	await updateDealStatus(request.params.id, DealStatus.done)
	return reply.status(200).send({ message: 'Deal status updated successfully' })
}

const getDealHandler = async (
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

	return {
		...deal,
		tokenId: deal.dealToken?.[0]?.tokenId,
		tokenAmount: deal.dealToken?.[0]?.tokenAmount
	}
}

export const dealRoutes = (app: FastifyInstance) => {
	app.post(
		'/deal',
		{ schema: DealSchemas.createDeal, preHandler: [app.admin] },
		createDealHandler
	)
	app.post(
		'/deal/token',
		{ schema: DealSchemas.createDealToken, preHandler: [app.admin] },
		createDealTokenHandler
	)
	app.post('/deal/withdraw/:id', { preHandler: [app.admin] }, withdrawDealHandler)
	app.post('/deal/close/:id', { preHandler: [app.admin] }, closeDealHandler)
	app.get('/deal/:id', { schema: DealSchemas.getDeal }, getDealHandler)
	app.get('/deals', async () => {
		const deals = await prisma.deal.findMany()
		return { deals }
	})
}
