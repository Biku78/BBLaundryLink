import { useEffect, useRef } from "react";

export default function Modal({ title, children, onClose, wide = false }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("button")?.focus();
    function keydown(event) {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const nodes = [
        ...dialogRef.current.querySelectorAll(
          'button, a[href], input, select, [tabindex="0"]',
        ),
      ].filter((node) => !node.disabled && node.getClientRects().length);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 p-md-4"
      onClick={onClose}
    >
      <section
        ref={dialogRef}
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close" aria-label="Close dialog" onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}
