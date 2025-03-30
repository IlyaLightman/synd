import Link from 'next/link'

import styles from './PageLink.module.css'
import { FC } from 'react'

type Props = {
	text: string
	href: string
}

// just link
export const PageLink: FC<Props> = ({ text, href }) => (
	<div className={styles.block}>
		<Link href={href}>
			<p>{text}</p>
		</Link>
	</div>
)
