"use client";

import { useRef, useState } from "react";
import { SmilePlus, MoreHorizontal, SendHorizontal } from "lucide-react";
// The design names Remix Icon's attachment-line here; react-icons ships the
// Remix set under the `ri` namespace.
import { RiAttachmentLine } from "react-icons/ri";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { useKanbanStore, type TaskComment } from "../store/useKanbanStore";

// Scaled so the 13.33px icons draw a true 1.5px stroke (see TaskActionsBar).
const STROKE = (1.5 * 24) / 13.33;
// Same, for the 16px paperclip/send icons on the reply rows.
const STROKE_16 = (1.5 * 24) / 16;

// A small fixed set — enough to react without pulling in an emoji library.
const EMOJIS = ["👍", "🎉", "👀", "🚀", "❤️", "😄", "🙏", "🔥"];



/**
 * Reaction picker. The API has no reactions field, so a pick is posted as a
 * short comment — it persists and everyone sees it, without inventing schema.
 */
function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hover:opacity-70"
        aria-label="React"
      >
        <SmilePlus className="h-[13.33px] w-[13.33px]" strokeWidth={STROKE} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 flex w-max gap-1 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1.5 shadow-md">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onPick(emoji);
                setOpen(false);
              }}
              className="rounded px-1 text-base hover:bg-[var(--base-accent)]"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Per-comment menu — deleting is the only action so far. */
function CommentActions({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hover:opacity-70"
        aria-label="Comment actions"
      >
        <MoreHorizontal
          className="h-[13.33px] w-[13.33px]"
          strokeWidth={STROKE}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-32 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full rounded-md px-3 py-2 text-left font-sans text-xs font-medium text-[var(--base-destructive)] hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/** Input row shared by the reply box and the new-comment box. */
function CommentInput({
  placeholder,
  showAvatar,
  onSubmit,
  className,
}: {
  placeholder: string;
  showAvatar?: boolean;
  onSubmit: (body: string) => void;
  className: string;
}) {
  const [value, setValue] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function submit() {
    const body = value.trim();
    if (!body) return;
    onSubmit(body);
    setValue("");
  }

  return (
    <div className={className}>
      {showAvatar && (
        <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
      )}
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
        }}
        placeholder={placeholder}
        className="flex-1 font-sans text-sm font-normal outline-none placeholder:text-neutral-400"
      />
      {/* No file storage on the server yet, so an attachment is recorded as a
          filename in the comment rather than an upload. */}
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setValue((current) => `${current} 📎 ${file.name}`.trim());
          event.target.value = "";
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="text-[var(--base-primary)] hover:opacity-70"
        aria-label="Attach a file"
      >
        <RiAttachmentLine className="h-4 w-4" />
      </button>
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="text-[var(--base-primary)] hover:opacity-70 disabled:opacity-40"
        aria-label="Post"
      >
        <SendHorizontal className="h-4 w-4" strokeWidth={STROKE_16} />
      </button>
    </div>
  );
}

export function TaskComments({
  taskId,
  comments,
}: {
  taskId: string;
  comments: TaskComment[];
}) {
  const user = useAuthStore((state) => state.user);
  const addCommentToStore = useKanbanStore((state) => state.addComment);
  const removeComment = useKanbanStore((state) => state.removeComment);
  const reactToComment = useKanbanStore((state) => state.reactToComment);

  function addComment(body: string) {
    void addCommentToStore(taskId, body);
  }

  function addReply(parentId: string, body: string) {
    void addCommentToStore(taskId, body, parentId);
  }

  // Replies hang off their parent; the top level is everything else.
  const topLevel = comments.filter((comment) => !comment.parentId);
  const repliesFor = (parentId: string) =>
    comments.filter((comment) => comment.parentId === parentId);

  function onReact(commentId: string, emoji: string) {
    void reactToComment(taskId, commentId, emoji);
  }

  return (
    <div className="mt-6 w-full max-w-[633px]">
      <p className="mb-2 align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
        Comments
      </p>

      <div className="flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
        {topLevel.map((comment) => (
          <div
            key={comment.id}
            className="shrink-0 rounded-md border border-[var(--base-input)]"
          >
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                  <span className="font-sans text-xs font-medium text-[var(--base-primary)]">
                    {comment.author}
                  </span>
                  <span className="font-sans text-xs font-normal text-slate-500">
                    {comment.postedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[var(--base-primary)]">
                  <EmojiPicker
                    onPick={(emoji) => onReact(comment.id, emoji)}
                  />
                  <CommentActions
                    onDelete={() => removeComment(taskId, comment.id)}
                  />
                </div>
              </div>
              <p className="text-sm text-[var(--base-primary)]">{comment.body}</p>
              {comment.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {comment.reactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => onReact(comment.id, emoji)}
                      className="flex h-6 items-center gap-1 rounded-full border border-[var(--base-border)] bg-[var(--base-secondary)] px-2 font-sans text-xs"
                      title="Click to remove"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {repliesFor(comment.id).map((reply) => (
              <div
                key={reply.id}
                className="flex flex-col gap-2 border-t px-4 py-3 pl-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                    <span className="font-sans text-xs font-medium text-[var(--base-primary)]">
                      {reply.author}
                    </span>
                    <span className="font-sans text-xs font-normal text-slate-500">
                      {reply.postedAt}
                    </span>
                  </div>
                  <CommentActions
                    onDelete={() => removeComment(taskId, reply.id)}
                  />
                </div>
                <p className="text-sm text-[var(--base-primary)]">{reply.body}</p>
              </div>
            ))}

            {/* Per-comment reply box, as in the design */}
            <CommentInput
              placeholder="Leave a reply..."
              showAvatar
              onSubmit={(body) => addReply(comment.id, body)}
              className="flex items-center gap-2 border-t px-4 py-3"
            />
          </div>
        ))}

        <CommentInput
          placeholder="Add a comment..."
          onSubmit={addComment}
          className="flex items-center gap-2 rounded-md border border-[var(--base-input)] px-4 py-4"
        />
      </div>
    </div>
  );
}
