import { FC } from 'react'

import cx from 'classnames'

import { DealStatus } from 'lib/types'

import styles from './DealStatusTag.module.css'

const tagsByStatus: Record<DealStatus, { tag: string; className: string }> = {
	[DealStatus.done]: {
		tag: 'Done',
		className: styles.tagDone
	},
	[DealStatus.failed]: {
		tag: 'Failed',
		className: styles.tagFailed
	},
	[DealStatus.raising]: {
		tag: 'Raising',
		className: styles.tagRaising
	},
	[DealStatus.invested]: {
		tag: 'Invested',
		className: styles.tagInvested
	}
}

export const DealStatusTag: FC<{ status: DealStatus }> = ({ status }) => {
	const { tag, className } = tagsByStatus[status]

	return (
		<div className={cx([styles.tag, className])}>
			<p>{tag}</p>
		</div>
	)
}
