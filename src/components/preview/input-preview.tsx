"use client";
import { useState } from "react";
export function InputPreview() {
  const [notifications, setNotifications] = useState(true);
  return (
    <div className="space-y-3">
      <h3
        className="text-xs font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        Inputs
      </h3>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Email address"
          aria-label="Empty email input example"
          readOnly
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
        <input
          type="text"
          defaultValue="hello@example.com"
          aria-label="Filled email input example"
          readOnly
          className="w-full px-3 py-2 rounded-lg text-sm border-2 outline-none"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--primary-solid)",
            color: "var(--text-primary)",
          }}
        />
        <div className="flex items-center gap-2">
          <button
            role="switch"
            aria-label="Preview notifications"
            aria-checked={notifications}
            onClick={() => setNotifications((value) => !value)}
            className="w-11 min-h-11 flex items-center"
          >
            <span
              className="w-9 h-5 rounded-full relative"
              style={{
                backgroundColor: notifications
                  ? "var(--primary-solid)"
                  : "var(--border-strong)",
              }}
            >
              <span
                className={`w-4 h-4 rounded-full absolute top-0.5 ${notifications ? "right-0.5" : "left-0.5"}`}
                style={{ backgroundColor: "var(--surface)" }}
              />
            </span>
          </button>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Notifications
          </span>
        </div>
      </div>
    </div>
  );
}
