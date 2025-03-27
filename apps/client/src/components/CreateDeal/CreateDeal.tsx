import Link from 'next/link'

import styles from './CreateDeal.module.css'

// just link
export const CreateDeal = () => (
	<div className={styles.block}>
		<Link href='/create'>
			<p>+ Create a deal</p>
		</Link>
	</div>
)
