export type HistoryData = {
	month: string
	valuation: number
}[]

export type HistoryResponse = {
	history: HistoryData
	invested: number
	valuation: number
}

export type Investment = {
	id: string
	ticker: string
	count: number
	date: string
}
