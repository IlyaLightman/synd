export enum DealStatus {
	done = 'done',
	failed = 'failed',
	raising = 'raising',
	invested = 'invested'
}

export type Deal = {
	title: string
	description: string
	allocation: number
	status: DealStatus
}
