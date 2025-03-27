import { Inter } from 'next/font/google'

import './globals.css'

import styles from './layout.module.css'
import { MetaMask } from '@/components/MetaMask/MetaMask'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Synd'
}

const Header = () => (
	<div className={styles.header}>
		<div />
		<MetaMask />
	</div>
)

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${inter.className}`}>
				<Providers>
					<div className={styles.layoutBlock}>
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	)
}
