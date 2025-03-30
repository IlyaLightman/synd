import styles from './FormInput.module.css'

export const FormInput = ({
	label,
	type = 'text',
	value,
	onChange,
	disabled
}: {
	label: string
	type?: string
	value: string
	onChange: (v: string) => void
	disabled?: boolean
}) => (
	<div className={styles.inputGroup}>
		<label>{label}</label>
		<input
			className={styles.input}
			type={type}
			value={value}
			onChange={e => onChange(e.target.value)}
			disabled={disabled}
		/>
	</div>
)

export const FormTextarea = ({
	label,
	value,
	onChange,
	disabled
}: {
	label: string
	value: string
	onChange: (v: string) => void
	disabled?: boolean
}) => (
	<div className={styles.inputGroup}>
		<label>{label}</label>
		<textarea
			className={styles.textarea}
			rows={4}
			value={value}
			onChange={e => onChange(e.target.value)}
			disabled={disabled}
		/>
	</div>
)
