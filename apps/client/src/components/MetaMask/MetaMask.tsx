'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from '@wagmi/connectors'

import cx from 'classnames'

import styles from './MetaMask.module.css'

const injectedConnector = injected()

const shortenAddress = (address: string) => `${address.slice(0, 4)}....${address.slice(-4)}`

export const MetaMask = () => {
	const { connect } = useConnect()
	const { disconnect } = useDisconnect()
	const { address, isConnected } = useAccount()

	if (isConnected) {
		return (
			<div className={cx([styles.block, styles.connected])} onClick={() => disconnect()}>
				<p>✅ Connected as {address ? shortenAddress(address) : '0x0'}</p>
			</div>
		)
	}

	return (
		<div
			className={cx([styles.block, styles.connect])}
			onClick={() => connect({ connector: injectedConnector })}
		>
			<p>➡️ Connect MetaMask</p>
		</div>
	)
}
