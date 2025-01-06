export const formatRub = (value: number) =>
	Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value)

export const formatPercent = (value: number) =>
	Intl.NumberFormat('ru-RU', {
		style: 'percent',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(value)

export const formatDate = (date: Date): string => {
	return date.toLocaleDateString('ru-RU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}
