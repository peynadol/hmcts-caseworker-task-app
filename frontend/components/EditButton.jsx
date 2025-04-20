export default function EditButton({ onClick }) {
  return (
    <button
      type="submit"
      className="govuk-button"
      data-module="govuk-button"
      onClick={onClick}
    >
      Edit Task
    </button>
  );
}
