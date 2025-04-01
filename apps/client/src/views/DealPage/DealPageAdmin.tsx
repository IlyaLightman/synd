'use client'

import { FC, useCallback, useState } from 'react'

import { Container } from '@/components/Container/Container'

import { DealStatus } from 'lib/types'

import styles from './DealPage.module.css'

import { ActionButton } from '@/components/ActionButton/ActionButton'

import { SYNDICATE_ADDRESS } from 'lib/addresses'
import { syndicateAbi } from 'lib/abi'
import { useWriteContract } from 'wagmi'
import { FormInput } from '@/components/FormInput/FormInput'
import { parseEther } from 'viem'

type AdminProps = {
	status: DealStatus
	allocationCompleted: boolean
	dealId: string
	tokenId: string
}

type AdminSteps = 'idle' | 'sending_transaction' | 'updating_status' | 'done' | 'error'

export const DealPageAdmin: FC<AdminProps> = ({ status, allocationCompleted, dealId, tokenId }) => {
	console.log(status, allocationCompleted, tokenId)

	const [step, setStep] = useState<AdminSteps>('idle')

	const [ethAmount, setEthAmount] = useState<string>('0')

	const { writeContractAsync } = useWriteContract()

	const handleAdminWithdrawal = useCallback(async () => {
		try {
			setStep('sending_transaction')

			await writeContractAsync({
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'withdrawFunds',
				args: [Number(tokenId)],
				value: BigInt(ethAmount)
			})

			setStep('updating_status')

			await fetch(`/api/deal/withdraw/${dealId}`, {
				method: 'POST',
				headers: { 'admin-signature': 'admin' }
			})

			setStep('done')
		} catch (err) {
			console.error(err)
			setStep('error')
		}
	}, [writeContractAsync, tokenId, ethAmount, dealId])

	const handleDealClose = useCallback(async () => {
		try {
			setStep('sending_transaction')

			await writeContractAsync({
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'depositProfit',
				args: [Number(tokenId)],
				value: parseEther(ethAmount)
			})

			setStep('updating_status')

			await fetch(`/api/deal/close/${dealId}`, {
				method: 'POST',
				headers: { 'admin-signature': 'admin' }
			})

			setStep('done')
		} catch (err) {
			console.error(err)
			setStep('error')
		}
	}, [writeContractAsync, ethAmount, tokenId, dealId])

	return (
		<Container>
			<div className={styles.admin}>
				<p>Администрирование</p>
				{status === DealStatus.raising && allocationCompleted && (
					<ActionButton
						text='Вывести ETH на инвестицию'
						onClick={handleAdminWithdrawal}
					/>
				)}
				{status === DealStatus.invested && (
					<>
						<FormInput
							label='ETH к распределению'
							type='number'
							value={ethAmount}
							onChange={setEthAmount}
						/>
						<ActionButton
							text='Внести ETH и закрыть инвестицию'
							onClick={handleDealClose}
						/>
					</>
				)}

				{step === 'sending_transaction' && <p>➤ Отправка транзакции....</p>}
				{step === 'updating_status' && <p>✍ Обновление статуса сделки....</p>}
				{step === 'done' && <p className={styles.success}>✅ Транзакция отправлена!</p>}
				{step === 'error' && <p className={styles.error}>❌ Произошла ошибка</p>}
			</div>
		</Container>
	)
}
