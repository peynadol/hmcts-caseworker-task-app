export default function AddTaskButton({ onClick }) {
	return (
		<button onClick={onClick} type="submit" class="govuk-button" data-module="govuk-button">
			Add Task
		</button>
	)
}
