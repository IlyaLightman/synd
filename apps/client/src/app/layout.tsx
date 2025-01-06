import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import styles from './layout.module.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Synd'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${inter.className}`}>
				<div className={styles.layoutBlock}>{children}</div>
			</body>
		</html>
	)
}
