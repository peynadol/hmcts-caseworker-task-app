export default function EditButton({ onClick }) {
  return (
    <button
      type="submit"
      class="govuk-button"
      data-module="govuk-button"
      onClick={onClick}
    >
      Edit Task
    </button>
  );
}
