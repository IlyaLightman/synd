'use client'

import { FC, useCallback, useEffect, useState } from 'react'

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
import { isAdmin } from 'lib/roles'
import { DealPageAdmin } from './DealPageAdmin'

type Props = {
	id: string
}

type DealContractData = [bigint, number, bigint, bigint, number, boolean, boolean, bigint]

type DealOnchainData = {
	pricePerToken: bigint
	totalTokens: number
	collected: bigint
	allocation: bigint
	deadline: Date
	owner: boolean
	balance: number
}

export const DealPage: FC<Props> = ({ id }) => {
	const { address } = useAccount()

	const [deal, setDeal] = useState<Deal | null>(null)
	const [dealOnchainData, setDealOnchainData] = useState<DealOnchainData | null>(null)

	const [buyAmount, setBuyAmount] = useState<string>('1')
	const [isBuying, setIsBuying] = useState(false)
	const [buyError, setBuyError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const { writeContractAsync } = useWriteContract()

	console.log(dealOnchainData)

	const fetchDeal = useCallback(async () => {
		try {
			const response = await fetch(`/api/deal/${id}`)
			const data = await response.json()
			setDeal(data)

			return data
		} catch (error) {
			console.error('Error fetching deals:', error)
		}
	}, [id])

	const fetchOnchainData = useCallback(
		async (tokenId: string) => {
			if (!address) return

			const dealData = (await readContract(config, {
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'deals',
				args: [tokenId]
			})) as DealContractData

			const balance = (await readContract(config, {
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'balanceOf',
				args: [address, tokenId]
			})) as number

			setDealOnchainData({
				pricePerToken: BigInt(dealData[0]),
				totalTokens: Number(dealData[1]),
				collected: BigInt(dealData[2]),
				allocation: BigInt(dealData[3]),
				deadline: new Date(Number(dealData[4]) * 1000),
				owner: dealData[5],
				balance
			})
		},
		[address]
	)

	const handleBuy = useCallback(async () => {
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

			setSuccessMessage(`Транзакция успешно отправлена!`)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setBuyError(err.message || 'Ошибка при покупке токенов')
		} finally {
			setIsBuying(false)
		}
	}, [buyAmount, deal, dealOnchainData, writeContractAsync])

	const claimProfit = useCallback(async () => {
		if (!deal || !dealOnchainData) return

		try {
			setIsBuying(true)
			setBuyError(null)
			setSuccessMessage(null)

			await writeContractAsync({
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'claimProfit',
				args: [Number(deal.tokenId)]
			})

			setSuccessMessage(`Транзакция успешно отправлена!`)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			setBuyError('Ошибка при получении ETH')
		} finally {
			setIsBuying(false)
		}
	}, [deal, dealOnchainData, writeContractAsync])

	useEffect(() => {
		fetchDeal().then(({ tokenId }) => fetchOnchainData(tokenId))
	}, [fetchDeal, fetchOnchainData])

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
						{showBuyButton && (
							<>
								<p>Токенов куплено: {dealOnchainData.collected}</p>
								<p>
									Цена за токен: {formatEther(dealOnchainData.pricePerToken)} ETH
								</p>
							</>
						)}
						<b>Баланс токенов: {dealOnchainData.balance}</b>
						{showBuyButton && (
							<>
								<div />
								<hr className={styles.line} />
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
							</>
						)}
						{deal.status === DealStatus.done && dealOnchainData.balance && (
							<>
								<div />
								<ActionButton text='Получить ETH за токены' onClick={claimProfit} />
							</>
						)}
					</div>
				)}
			</Container>
			{isAdmin(address) && deal && deal.tokenId && dealOnchainData && (
				<DealPageAdmin
					status={deal.status}
					allocationCompleted={
						dealOnchainData.totalTokens === Number(dealOnchainData.collected)
					}
					dealId={deal.id}
					tokenId={deal.tokenId}
				/>
			)}
			<PageLink text='← Ко всем сделкам' href='/' />
		</div>
	)
}
