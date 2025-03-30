export enum DealStatus {
	done = 'done',
	failed = 'failed',
	raising = 'raising',
	invested = 'invested',
	draft = 'draft'
}

export type Deal = {
	id: string
	name: string
	description: string
	allocationRub: number
	allocationEth?: string
	status: DealStatus

	tokenId?: string
	tokenAmount?: number
}
