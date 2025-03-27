import { FC } from 'react'

import { Deal } from 'lib/types'

import Link from 'next/link'
import { Container } from '../Container/Container'

import { DealStatusTag } from '../DealStatusTag/DealStatusTag'
import { formatRub } from 'utils'

import styles from './DealRow.module.css'

export const DealRow: FC<Deal> = ({ title, description, allocation, status }) => {
	const formattedAllocation = formatRub(allocation)

	return (
		<Link href='/deal/123' className={styles.link}>
			<Container>
				<div className={styles.block}>
					<div className={styles.leftBlock}>
						<b>{title}</b>
						<p>{description}</p>
					</div>
					<div className={styles.rightBlock}>
						<b>{formattedAllocation}</b>
						<DealStatusTag status={status} />
					</div>
				</div>
			</Container>
		</Link>
	)
}
