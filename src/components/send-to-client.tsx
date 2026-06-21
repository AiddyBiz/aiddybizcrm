import { useMemo, useState } from "react";
import { Search, X, Send, MessageCircle, Phone, Mail } from "lucide-react";
import { LEADS, type Lead } from "@/lib/leads-data";
import { toast } from "sonner";

export type Shareable = {
  title: string;
  // Plain-text body to send (already includes line breaks, link, etc.)
  body: string;
};

export function SendToClientModal({
  payload,
  onClose,
}: {
  payload: Shareable;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return LEADS;
    return LEADS.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        l.phone.toLowerCase().includes(s) ||
        l.email.toLowerCase().includes(s) ||
        l.project.toLowerCase().includes(s),
    );
  }, [q]);

  function digits(p: string) {
    return p.replace(/[^\d]/g, "");
  }

  function sendVia(channel: "whatsapp" | "sms" | "email") {
    if (!picked) return;
    const text = `${payload.title}\n\n${payload.body}`;
    let url = "";
    if (channel === "whatsapp")
      url = `https://wa.me/${digits(picked.phone)}?text=${encodeURIComponent(text)}`;
    else if (channel === "sms")
      url = `sms:${picked.phone}?body=${encodeURIComponent(text)}`;
    else
      url = `mailto:${picked.email}?subject=${encodeURIComponent(payload.title)}&body=${encodeURIComponent(payload.body)}`;
    window.open(url, "_blank");
    toast.success(`Sent to ${picked.name}`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Send to client
            </p>
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {payload.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!picked ? (
          <>
            <div className="px-4 pt-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search leads by name, phone, email…"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-8 text-center text-xs text-slate-500">
                  No leads match "{q}"
                </li>
              )}
              {filtered.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => setPicked(l)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {l.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {l.name}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {l.phone} · {l.project}
                      </p>
                    </div>
                    <Send className="h-3.5 w-3.5 text-indigo-600" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={() => setPicked(null)}
              className="text-[11px] font-semibold text-indigo-600"
            >
              ← Pick a different lead
            </button>
            <div className="mt-3 rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{picked.name}</p>
              <p className="text-[11px] text-slate-500">
                {picked.phone} · {picked.email}
              </p>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Preview
            </p>
            <pre className="mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700">
              {payload.title}
              {"\n\n"}
              {payload.body}
            </pre>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                onClick={() => sendVia("whatsapp")}
                className="flex flex-col items-center gap-1 rounded-xl bg-emerald-600 px-2 py-3 text-[11px] font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
              <button
                onClick={() => sendVia("sms")}
                className="flex flex-col items-center gap-1 rounded-xl bg-slate-700 px-2 py-3 text-[11px] font-semibold text-white"
              >
                <Phone className="h-4 w-4" /> SMS
              </button>
              <button
                onClick={() => sendVia("email")}
                className="flex flex-col items-center gap-1 rounded-xl bg-indigo-600 px-2 py-3 text-[11px] font-semibold text-white"
              >
                <Mail className="h-4 w-4" /> Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
