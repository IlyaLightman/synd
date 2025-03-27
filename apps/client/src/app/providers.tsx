'use client'

import { config } from 'lib/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { WagmiProvider } from 'wagmi'

export const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	)
}
