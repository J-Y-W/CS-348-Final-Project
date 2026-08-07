import Modal from "./Modal.jsx";

export default function ConfirmDialog({ title, description, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-ink-soft">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-soft hover:bg-bg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-md bg-danger px-3 py-2 text-sm font-medium text-white hover:bg-danger/90"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
