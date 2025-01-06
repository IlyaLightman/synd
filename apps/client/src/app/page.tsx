import styles from './page.module.css'

export default async function Page() {
	try {
		return <div className={styles.dashboard}>Synd</div>
	} catch (err) {
		console.error(err)
	}
}
