import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from '@wagmi/connectors'

export const config = createConfig({
	chains: [sepolia],
	connectors: [injected()],
	transports: {
		[sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com')
	},
	ssr: true
})
