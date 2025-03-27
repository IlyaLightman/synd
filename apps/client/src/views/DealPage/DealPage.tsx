'use client'

import { FC } from 'react'

import { Container } from '@/components/Container/Container'
import { DealStatusTag } from '@/components/DealStatusTag/DealStatusTag'
import { DealStatus } from 'lib/types'

import styles from './DealPage.module.css'
import { formatRub } from 'utils'
import { ActionButton } from '@/components/ActionButton/ActionButton'

export const DealPage: FC<{ id: string }> = ({ id }) => {
	const deal = {
		title: `Deal ${id}`,
		description: 'Description of the deal',
		status: DealStatus.raising,
		allocation: 10000000,
		raised: 7200000,
		tokens: 1000,
		distributedTokens: 720
	}

	const showBuyButton = [DealStatus.raising].includes(deal.status)

	return (
		<Container>
			<div className={styles.page}>
				<div className={styles.header}>
					<div className={styles.title}>
						<b>Deal {id}</b>
						<DealStatusTag status={deal.status} />
					</div>
					<b>{formatRub(deal.allocation)}</b>
				</div>
				<p>{deal.description}</p>
				<div />
				<p>Raised: {formatRub(deal.raised)}</p>
				<p>Tokens: {deal.tokens}</p>
				<p>Distributed tokens: {deal.distributedTokens}</p>
				<div />
				{showBuyButton && <ActionButton text='Buy tokens' onClick={() => {}} />}
			</div>
		</Container>
	)
}
