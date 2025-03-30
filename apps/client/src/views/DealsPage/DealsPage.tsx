'use client'

import { useAccount } from 'wagmi'

import { DealRow } from '@/components/DealRow/DealRow'

import { Deal } from 'lib/types'
import { isAdmin } from 'lib/roles'
import { PageLink } from '@/components/PageLink/PageLink'

import styles from './DealsPage.module.css'
import { useEffect, useState } from 'react'

export const DealsPage = () => {
	const { address } = useAccount()

	const [deals, setDeals] = useState<Deal[] | null>(null)

	const fetchDeals = async () => {
		try {
			const response = await fetch('/api/deals')
			const data = await response.json()
			setDeals(data.deals)
		} catch (error) {
			console.error('Error fetching deals:', error)
		}
	}

	useEffect(() => {
		fetchDeals()
	}, [])

	return (
		<div className={styles.page}>
			{deals?.map(deal => (
				<DealRow
					id={deal.id}
					key={deal.id}
					name={deal.name}
					description={deal.description}
					allocationRub={deal.allocationRub}
					status={deal.status}
				/>
			))}
			{isAdmin(address) && <PageLink text='+ Создать сделку' href='/deal/create' />}
		</div>
	)
}
