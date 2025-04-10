export default function DeleteButton({ onClick }) {
	return (
		<button onClick={onClick} type="submit" class="govuk-button govuk-button--warning" data-module="govuk-button">
			Delete Task
		</button>
	)
}
