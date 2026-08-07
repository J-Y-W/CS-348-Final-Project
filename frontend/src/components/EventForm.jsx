import { useState } from "react";
import Modal from "./Modal.jsx";

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Event name is required.";
  if (!form.event_date) errors.event_date = "Pick a date.";
  return errors;
}

export default function EventForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name: "", event_date: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="New event" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Event name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            className={`mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink outline-none ${
              errors.name ? "border-danger" : "border-line focus:border-primary"
            }`}
          />
          {errors.name && <span className="mt-1 block text-xs text-danger">{errors.name}</span>}
        </label>

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Date</span>
          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            aria-invalid={Boolean(errors.event_date)}
            className={`mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink outline-none ${
              errors.event_date ? "border-danger" : "border-line focus:border-primary"
            }`}
          />
          {errors.event_date && <span className="mt-1 block text-xs text-danger">{errors.event_date}</span>}
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-soft hover:bg-bg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create event"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
