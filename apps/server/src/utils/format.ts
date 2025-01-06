const monthsRu = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь'
]

export const formatToMonthYear = (date: Date) => {
	const month = monthsRu[date.getMonth()]
	const year = date.getFullYear()
	return `${month} ${year}`
}
