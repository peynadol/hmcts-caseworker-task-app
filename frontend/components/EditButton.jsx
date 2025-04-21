export default function EditButton({ onClick }) {
  return (
    <button
      type="submit"
      className="govuk-button"
      data-module="govuk-button"
      onClick={(e) => {
        e.stopPropagation();
        onclick(e);
      }}
    >
      Edit Task
    </button>
  );
}
