import { FC, PropsWithChildren } from 'react'

import styles from './Container.module.css'

export const Container: FC<PropsWithChildren> = ({ children }) => (
	<div className={styles.block}>{children}</div>
)
