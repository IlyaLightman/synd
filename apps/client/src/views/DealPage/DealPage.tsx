'use client'

import { FC, useEffect, useState } from 'react'

import { Container } from '@/components/Container/Container'
import { DealStatusTag } from '@/components/DealStatusTag/DealStatusTag'
import { Deal, DealStatus } from 'lib/types'

import styles from './DealPage.module.css'
import { formatRub } from 'utils'
import { ActionButton } from '@/components/ActionButton/ActionButton'
import { readContract } from 'wagmi/actions'
import { SYNDICATE_ADDRESS } from 'lib/addresses'
import { syndicateAbi } from 'lib/abi'
import { config } from 'lib/wagmi'
import { useAccount, useWriteContract } from 'wagmi'
import { formatEther } from 'viem'
import { FormInput } from '@/components/FormInput/FormInput'
import { PageLink } from '@/components/PageLink/PageLink'

export const DealPage: FC<{ id: string }> = ({ id }) => {
	const { address } = useAccount()

	const [deal, setDeal] = useState<Deal | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [dealOnchainData, setDealOnchainData] = useState<any>(null)

	const [buyAmount, setBuyAmount] = useState<string>('1')
	const [isBuying, setIsBuying] = useState(false)
	const [buyError, setBuyError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const { writeContractAsync } = useWriteContract()

	console.log(dealOnchainData)

	const fetchDeal = async () => {
		try {
			const response = await fetch(`/api/deal/${id}`)
			const data = await response.json()
			setDeal(data)

			return data
		} catch (error) {
			console.error('Error fetching deals:', error)
		}
	}

	const fetchOnchainData = async (tokenId: string) => {
		if (!address) return

		const dealData = (await readContract(config, {
			address: SYNDICATE_ADDRESS,
			abi: syndicateAbi,
			functionName: 'deals',
			args: [tokenId]
		})) as string[]

		const balance = await readContract(config, {
			address: SYNDICATE_ADDRESS,
			abi: syndicateAbi,
			functionName: 'balanceOf',
			args: [address, tokenId]
		})

		setDealOnchainData({
			pricePerToken: BigInt(dealData[0]),
			totalTokens: Number(dealData[1]),
			collected: BigInt(dealData[2]),
			allocation: BigInt(dealData[3]),
			deadline: new Date(Number(dealData[4]) * 1000),
			owner: dealData[5],
			isClosed: dealData[6],
			isRefundEnabled: dealData[7],
			balance
		})
	}

	const handleBuy = async () => {
		if (!deal || !dealOnchainData || !buyAmount) return

		try {
			setIsBuying(true)
			setBuyError(null)
			setSuccessMessage(null)

			const pricePerTokenEth = dealOnchainData.pricePerToken as bigint
			const totalEth = pricePerTokenEth * BigInt(buyAmount)

			await writeContractAsync({
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'invest',
				args: [Number(deal.tokenId), Number(buyAmount)],
				value: BigInt(totalEth.toString())
			})

			setSuccessMessage(`Успешная покупка!`)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setBuyError(err.message || 'Ошибка при покупке токенов')
		} finally {
			setIsBuying(false)
		}
	}

	useEffect(() => {
		fetchDeal().then(({ tokenId }) => fetchOnchainData(tokenId))
	}, [address])

	const showBuyButton = deal && [DealStatus.raising].includes(deal.status)

	return (
		<div className={styles.page}>
			<Container>
				{!deal ? (
					<p>✨ Загрузка сделки....</p>
				) : !dealOnchainData ? (
					<p>✨ Загрузка данных с контракта....</p>
				) : (
					<div className={styles.block}>
						<div className={styles.header}>
							<div className={styles.title}>
								<b>{deal.name}</b>
								{deal.status && <DealStatusTag status={deal.status} />}
							</div>
							<b>{formatRub(deal.allocationRub)}</b>
						</div>
						<p>{deal.description}</p>
						<div />
						<p>Аллокация ETH: {formatEther(dealOnchainData.allocation)} ETH</p>
						<p>Токенов выпущено: {deal.tokenAmount}</p>
						<p>Токенов куплено: {dealOnchainData.collected}</p>
						<p>Цена за токен: {formatEther(dealOnchainData.pricePerToken)} ETH</p>
						<b>Баланс токенов: {dealOnchainData.balance}</b>
						<div />
						<hr className={styles.line} />
						{showBuyButton && (
							<div className={styles.invest}>
								<FormInput
									label='Купить токены'
									value={buyAmount}
									onChange={setBuyAmount}
								/>
								<ActionButton text='Инвестировать' onClick={handleBuy} />
								{isBuying && <p>✨ Покупка....</p>}
								{buyError && <p className={styles.error}>❌ {buyError}</p>}
								{successMessage && (
									<p className={styles.success}>✅ {successMessage}</p>
								)}
							</div>
						)}
					</div>
				)}
			</Container>
			<PageLink text='← Ко всем сделкам' href='/' />
		</div>
	)
}
