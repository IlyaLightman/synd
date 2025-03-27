import { FC } from 'react'

import styles from './ActionButton.module.css'

type Props = {
	text: string
	onClick: () => void
}

export const ActionButton: FC<Props> = ({ text, onClick }) => (
	<button onClick={onClick} className={styles.block}>
		{text}
	</button>
)
