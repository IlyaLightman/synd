'use client'

import { useAccount } from 'wagmi'

import { DealRow } from '@/components/DealRow/DealRow'

import { DealStatus } from 'lib/types'
import { isAdmin } from 'lib/roles'
import { CreateDeal } from '@/components/CreateDeal/CreateDeal'

import styles from './DealsPage.module.css'

export const DealsPage = () => {
	const { address } = useAccount()

	return (
		<div className={styles.page}>
			<DealRow
				title='Deal I'
				description='My deal my deal'
				allocation={15000000}
				status={DealStatus.done}
			/>
			<DealRow
				title='Deal II'
				description='Another deal'
				allocation={100000}
				status={DealStatus.raising}
			/>
			<DealRow
				title='The new deal'
				description='Lets invest'
				allocation={7230000}
				status={DealStatus.invested}
			/>
			{isAdmin(address) && <CreateDeal />}
		</div>
	)
}
