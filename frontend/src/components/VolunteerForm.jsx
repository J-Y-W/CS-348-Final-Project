import { useState } from "react";
import Modal from "./Modal.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!EMAIL_RE.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  const age = Number(form.age);
  if (!form.age || Number.isNaN(age) || age < 0 || age > 120) {
    errors.age = "Enter an age between 0 and 120.";
  }
  return errors;
}

const emptyForm = { name: "", email: "", phone: "", age: "" };

export default function VolunteerForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initial);

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
      await onSubmit({ ...form, age: Number(form.age) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEditing ? "Edit volunteer" : "Add volunteer"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
        <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} error={errors.age} />

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
            {submitting ? "Saving…" : isEditing ? "Save changes" : "Add volunteer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, name, value, onChange, error, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink outline-none ${
          error ? "border-danger" : "border-line focus:border-primary"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
