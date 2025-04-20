export default function AddTaskButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="govuk-button"
      data-module="govuk-button"
    >
      Add Task
    </button>
  );
}
