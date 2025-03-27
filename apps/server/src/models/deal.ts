import { DealStatus } from '@prisma/client'

export type CreateDealRequest = {
	name: string
	description: string
	allocationRub: number
	allocationEth: string
}

export type CreateDealTokenRequest = {
	dealId: string
	tokenId: string
	tokenAmount: number
}

export type Deal = {
	id: string
	name: string
	description: string
	allocationRub: number
	allocationEth: string
	tokenId: string
	tokenAmount: number
	status: DealStatus
}

const dealResponseSchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		name: { type: 'string' },
		description: { type: 'string' },
		allocationRub: { type: 'number' },
		allocationEth: { type: 'string' },
		tokenId: { type: 'string', nullable: true },
		tokenAmount: { type: 'number', nullable: true },
		status: { type: 'string', enum: Object.values(DealStatus) }
	}
}

export const DealSchemas = {
	createDeal: {
		body: {
			type: 'object',
			required: ['name', 'description', 'allocationRub', 'allocationEth'],
			properties: {
				name: { type: 'string' },
				description: { type: 'string' },
				allocationRub: { type: 'number' },
				allocationEth: { type: 'string' }
			}
		},
		response: {
			201: dealResponseSchema
		}
	},
	createDealToken: {
		body: {
			type: 'object',
			required: ['dealId', 'tokenId', 'tokenAmount'],
			properties: {
				dealId: { type: 'string' },
				tokenId: { type: 'string' },
				tokenAmount: { type: 'number' }
			}
		},
		response: {
			201: dealResponseSchema
		}
	},
	getDeal: {
		params: {
			type: 'object',
			required: ['id'],
			properties: {
				id: { type: 'string' }
			}
		},
		response: {
			200: dealResponseSchema
		}
	},
	getDeals: {
		response: {
			200: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						name: { type: 'string' },
						description: { type: 'string' },
						allocationRub: { type: 'number' },
						status: { type: 'string', enum: Object.values(DealStatus) }
					}
				}
			}
		}
	}
}
