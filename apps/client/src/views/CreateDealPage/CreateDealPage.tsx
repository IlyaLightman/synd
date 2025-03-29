'use client'

import { useState } from 'react'
import { Container } from 'components/Container/Container'
import { ActionButton } from 'components/ActionButton/ActionButton'
import styles from './CreateDealPage.module.css'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { syndicateAbi } from 'lib/abi'
import { SYNDICATE_ADDRESS } from 'lib/addresses'
import { parseEther } from 'viem'
import { readContract } from 'wagmi/actions'
import { config } from 'lib/wagmi'

const FormInput = ({
	label,
	type = 'text',
	value,
	onChange,
	disabled
}: {
	label: string
	type?: string
	value: string
	onChange: (v: string) => void
	disabled?: boolean
}) => (
	<div className={styles.inputGroup}>
		<label>{label}</label>
		<input
			className={styles.input}
			type={type}
			value={value}
			onChange={e => onChange(e.target.value)}
			disabled={disabled}
		/>
	</div>
)

const FormTextarea = ({
	label,
	value,
	onChange,
	disabled
}: {
	label: string
	value: string
	onChange: (v: string) => void
	disabled?: boolean
}) => (
	<div className={styles.inputGroup}>
		<label>{label}</label>
		<textarea
			className={styles.textarea}
			rows={4}
			value={value}
			onChange={e => onChange(e.target.value)}
			disabled={disabled}
		/>
	</div>
)

type DealCreationStep =
	| 'idle'
	| 'reading_contract'
	| 'creating_backend'
	| 'sending_transaction'
	| 'linking_token'
	| 'done'
	| 'error'

export const CreateDealPage = () => {
	const [step, setStep] = useState<DealCreationStep>('idle')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const [form, setForm] = useState({
		name: '',
		description: '',
		allocationRub: '',
		allocationEth: '',
		tokens: '',
		durationDays: '7'
	})

	const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
	const { writeContractAsync } = useWriteContract()
	const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash ?? undefined })

	const updateField = (field: string, value: string) => {
		setForm(prev => ({ ...prev, [field]: value }))
	}

	const handleCreate = async () => {
		try {
			setErrorMessage(null)

			setStep('reading_contract')
			setErrorMessage(null)

			const nextId = await readContract(config, {
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'nextDealId'
			})

			const tokenId = Number(nextId)

			setStep('creating_backend')

			const response = await fetch('/api/deal', {
				method: 'POST',
				body: JSON.stringify({
					name: form.name,
					description: form.description,
					allocationRub: Number(form.allocationRub),
					allocationEth: Number(form.allocationEth)
				}),
				headers: { 'Content-Type': 'application/json', 'admin-signature': 'admin' }
			})

			if (!response.ok) {
				throw new Error(`Ошибка при создании сделки на сервере, код: ${response.status}`)
			}

			const deal = await response.json()

			const pricePerToken = Number(form.allocationEth) / Number(form.tokens)
			const priceWei = parseEther(pricePerToken.toString())
			const duration = Number(form.durationDays) * 86400

			setStep('sending_transaction')

			const tx = await writeContractAsync({
				address: SYNDICATE_ADDRESS,
				abi: syndicateAbi,
				functionName: 'createDeal',
				args: [priceWei, Number(form.tokens), parseEther(form.allocationEth), duration]
			}).catch(err => {
				throw new Error('Ошибка отправки транзакции: ' + err.message)
			})

			setTxHash(tx)
			setStep('linking_token')

			const tokenResponse = await fetch('/api/deal/token', {
				method: 'POST',
				body: JSON.stringify({
					dealId: deal.id,
					tokenId,
					tokenAmount: form.tokens
				}),
				headers: { 'Content-Type': 'application/json', 'admin-signature': 'admin' }
			})

			if (!tokenResponse.ok) {
				throw new Error('Ошибка при связывании сделки с токеном')
			}

			setStep('done')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setErrorMessage(err.message || 'Произошла ошибка')
			setStep('error')
		}
	}

	const formCommonProps = {
		disabled: step !== 'idle'
	}

	return (
		<Container>
			<div className={styles.page}>
				<div className={styles.header}>
					<b>Создать сделку</b>
				</div>

				<FormInput
					label='Название сделки'
					value={form.name}
					onChange={v => updateField('name', v)}
					{...formCommonProps}
				/>
				<FormTextarea
					label='Описание'
					value={form.description}
					onChange={v => updateField('description', v)}
					{...formCommonProps}
				/>
				<FormInput
					label='Аллокация (₽) — информационно'
					type='number'
					value={form.allocationRub}
					onChange={v => updateField('allocationRub', v)}
					{...formCommonProps}
				/>
				<FormInput
					label='Аллокация (ETH) — используется в контракте'
					type='number'
					value={form.allocationEth}
					onChange={v => updateField('allocationEth', v)}
					{...formCommonProps}
				/>
				<FormInput
					label='Количество токенов'
					type='number'
					value={form.tokens}
					onChange={v => updateField('tokens', v)}
					{...formCommonProps}
				/>
				<FormInput
					label='Длительность сбора (в днях)'
					type='number'
					value={form.durationDays}
					onChange={v => updateField('durationDays', v)}
					{...formCommonProps}
				/>

				<div className={styles.buttonResult}>
					{step === 'idle' && (
						<ActionButton text='Создать сделку' onClick={handleCreate} />
					)}

					{step !== 'idle' && step !== 'done' && (
						<div className={styles.status}>
							{step === 'reading_contract' && '🔍 Считывание контракта....'}
							{step === 'creating_backend' && '📦 Создание сделки в базе....'}
							{step === 'sending_transaction' &&
								'🚀 Отправка транзакции в блокчейн....'}
							{step === 'linking_token' && '🔗 Связывание сделки с токеном....'}
						</div>
					)}

					{step === 'done' && isSuccess && (
						<>
							<p className={styles.success}>✅ Сделка успешно создана!</p>
							<ActionButton
								text='На главную'
								onClick={() => (window.location.href = '/')}
							/>
						</>
					)}

					{step === 'error' && <p className={styles.error}>❌ {errorMessage}</p>}
				</div>
			</div>
		</Container>
	)
}
