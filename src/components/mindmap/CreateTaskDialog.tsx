"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { MemberOption } from "./MindMapToolbar";

interface CreateTaskDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  members?: MemberOption[];
  onCreate: (args: { name: string; assigneeIds: number[] }) => Promise<void>;
}

export function CreateTaskDialog({
  title,
  open,
  onClose,
  onCreate,
  members = [],
}: CreateTaskDialogProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setAssigneeIds([]);
    setError(null);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t("error.enterTaskName"));
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onCreate({ name: trimmed, assigneeIds });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.createTask"));
    } finally {
      setSaving(false);
    }
  };

  const sortedMembers = [...members].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {t("mindmap.createHint")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("mindmap.taskName")}
              disabled={saving}
            />
          </div>

          {sortedMembers.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                {t("common.assignees")}
              </p>
              <div className="max-h-40 overflow-auto rounded-xl border border-[var(--border-strong)] bg-[var(--panel-solid)] p-2">
                <div className="grid grid-cols-1 gap-1">
                  {sortedMembers.map((m) => {
                    const id = parseInt(m.userId, 10);
                    const checked = assigneeIds.includes(id);
                    return (
                      <label
                        key={`${m.teamId}:${m.userId}`}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-800 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/8"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={saving}
                          onChange={() => {
                            setAssigneeIds((prev) => {
                              if (prev.includes(id)) return prev.filter((x) => x !== id);
                              return [...prev, id];
                            });
                          }}
                        />
                        <span className="truncate">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}

          <DialogFooter className="mt-5">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("common.creating") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
