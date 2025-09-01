"use client";

import React from "react";
import AvatarCircle from "./AvatarCircle";
import Tag from "./Tag";
import EditIcon from "./icons/EditIcon";
import CheckIcon from "./icons/CheckIcon";
import CloseIcon from "./icons/CloseIcon";
import { updateSession } from "@/lib/sessions";
import { useSessionStore } from "@/store/useSessionStore";

export interface SettingsProfileHeaderProps {
  name: string;
  role?: string;
  description?: string;
  status?: { label: string; variant?: "success" | "default" };
  tags?: string[];
  lastUpdatedText?: string;
  avatar?: { initials: string; imageUrl?: string; size?: number };
  className?: string;
}

export default function SettingsProfileHeader({
  name,
  role,
  description,
  status,
  tags = [],
  lastUpdatedText,
  avatar = { initials: "", size: 86 },
  className = "",
}: SettingsProfileHeaderProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftDescription, setDraftDescription] = React.useState(
    description || ""
  );
  const [draftTags, setDraftTags] = React.useState<string[]>(tags);

  const handleStartEdit = () => {
    setDraftDescription(description || "");
    setDraftTags(tags);
    setIsEditing(true);
  };
  const handleCancel = () => {
    setDraftDescription(description || "");
    setDraftTags(tags);
    setIsEditing(false);
  };
  const handleCommit = () => {
    // In a real app this would call an onChange prop or persist via API.
    // For now, we update local derived values and exit edit mode.
    if (typeof description !== "undefined") {
      // eslint-disable-next-line no-param-reassign
      description = draftDescription;
    }
    // eslint-disable-next-line no-param-reassign
    tags = draftTags;
    setIsEditing(false);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !draftTags.includes(value)) {
        setDraftTags([...draftTags, value]);
        (e.target as HTMLInputElement).value = "";
      }
      e.preventDefault();
    }
    if (
      e.key === "Backspace" &&
      (e.target as HTMLInputElement).value === "" &&
      draftTags.length
    ) {
      setDraftTags(draftTags.slice(0, -1));
    }
  };

  return (
    <div className={`flex items-start gap-6 ${className}`}>
      <div className="flex-shrink-0">
        <AvatarCircle
          initials={avatar.initials}
          imageUrl={avatar.imageUrl}
          size={avatar.size ?? 86}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-semibold text-[#0f0f10]">{name}</div>
            {role && (
              <div className="text-sm text-[#687076] -mt-0.5">{role}</div>
            )}
          </div>
          {status && (
            <Tag
              label={status.label}
              variant={status.variant ?? "default"}
              size="sm"
              className="!h-[27px] !px-4"
            />
          )}
        </div>

        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              className="w-full max-w-2xl text-base leading-6 text-[#616161] border border-gray-200 rounded-md p-2"
              rows={2}
            />
          ) : (
            description && (
              <p className="text-base leading-6 text-[#616161] flex items-center gap-2">
                {description}
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Edit description"
                >
                  <EditIcon className="w-4 h-4 cursor-pointer" />
                </button>
              </p>
            )
          )}
        </div>

        <div className="mt-4">
          {isEditing ? (
            <div className="flex items-center gap-3 flex-wrap">
              {draftTags.map((t, idx) => (
                <div key={`${t}-${idx}`} className="flex items-center gap-1">
                  <Tag label={t} />
                  <button
                    type="button"
                    onClick={() =>
                      setDraftTags(draftTags.filter((x, i) => i !== idx))
                    }
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Remove ${t}`}
                  >
                    <CloseIcon className="w-3.5 h-3.5 cursor-pointer" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add tag and press Enter"
                onKeyDown={handleTagInputKeyDown}
                className="border border-gray-200 rounded-md px-2 py-1 text-sm"
              />
            </div>
          ) : (
            tags.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                {tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="text-gray-500 hover:text-gray-700 ml-1"
                  aria-label="Edit tags"
                >
                  <EditIcon className="w-4 h-4 cursor-pointer" />
                </button>
              </div>
            )
          )}
        </div>

        {lastUpdatedText && (
          <p className="text-[10px] italic text-[#717680] mt-4">
            {lastUpdatedText}
          </p>
        )}

        {isEditing && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCommit}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-200 cursor-pointer"
            >
              <CheckIcon className="w-4 h-4 cursor-pointer" /> Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200 cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 cursor-pointer" /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Editable wrapper used in Session Settings that persists via API
export function EditableSessionHeader({
  sessionId,
  name,
  onNameChange,
  role,
  description,
  onDescriptionChange,
  status,
  tags = [],
  onTagsChange,
  lastUpdatedText,
  avatar = { initials: "", size: 86 },
  className = "",
  saving = false,
  setSaving,
}: SettingsProfileHeaderProps & {
  sessionId: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onTagsChange: (v: string[]) => void;
  saving?: boolean;
  setSaving?: (v: boolean) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState(name);
  const [draftDescription, setDraftDescription] = React.useState(
    description || ""
  );
  const [draftTags, setDraftTags] = React.useState<string[]>(tags);

  React.useEffect(() => setDraftName(name), [name]);
  React.useEffect(() => setDraftDescription(description || ""), [description]);
  React.useEffect(() => setDraftTags(tags), [tags]);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !draftTags.includes(value)) {
        setDraftTags([...draftTags, value]);
        (e.target as HTMLInputElement).value = "";
      }
      e.preventDefault();
    }
    if (
      e.key === "Backspace" &&
      (e.target as HTMLInputElement).value === "" &&
      draftTags.length
    ) {
      setDraftTags(draftTags.slice(0, -1));
    }
  };

  const commit = async () => {
    try {
      setSaving?.(true);
      await updateSession(sessionId, {
        name: draftName,
        description: draftDescription,
        tags: draftTags,
      });
      // Update the session store to keep it consistent
      useSessionStore.getState().updateSession(sessionId, {
        name: draftName,
        description: draftDescription,
        tags: draftTags,
      });
      onNameChange(draftName);
      onDescriptionChange(draftDescription);
      onTagsChange(draftTags);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving?.(false);
    }
  };

  return (
    <div className={`flex items-start gap-6 ${className}`}>
      <div className="flex-shrink-0">
        <AvatarCircle
          initials={avatar.initials}
          imageUrl={avatar.imageUrl}
          size={avatar.size ?? 86}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="text-2xl font-semibold text-[#0f0f10] border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <div className="text-2xl font-semibold text-[#0f0f10]">
                {name || "Name Your Bot"}
              </div>
            )}
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Edit name"
              >
                <EditIcon className="w-4 h-4 cursor-pointer" />
              </button>
            )}
          </div>
          {status && (
            <Tag
              label={status.label}
              variant={status.variant ?? "default"}
              size="sm"
              className="!h-[27px] !px-4"
            />
          )}
        </div>

        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              className="w-full max-w-2xl text-base leading-6 text-[#616161] border border-gray-200 rounded-md p-2"
              rows={2}
            />
          ) : (
            description && (
              <p className="text-base leading-6 text-[#616161]">
                {description}
              </p>
            )
          )}
        </div>

        <div className="mt-4">
          {isEditing ? (
            <div className="flex items-center gap-3 flex-wrap">
              {draftTags.map((t, idx) => (
                <div key={`${t}-${idx}`} className="flex items-center gap-1">
                  <Tag label={t} />
                  <button
                    type="button"
                    onClick={() =>
                      setDraftTags(draftTags.filter((x, i) => i !== idx))
                    }
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Remove ${t}`}
                  >
                    <CloseIcon className="w-3.5 h-3.5 cursor-pointer" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add tag and press Enter"
                onKeyDown={handleTagInputKeyDown}
                className="border border-gray-200 rounded-md px-2 py-1 text-sm"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              {tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700 ml-1"
                aria-label="Edit tags"
              >
                <EditIcon className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
          )}
        </div>

        {lastUpdatedText && (
          <p className="text-[10px] italic text-[#717680] mt-4">
            {lastUpdatedText}
          </p>
        )}

        {isEditing && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={commit}
              disabled={saving}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-200 cursor-pointer disabled:opacity-60"
            >
              <CheckIcon className="w-4 h-4 cursor-pointer" /> Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200 cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 cursor-pointer" /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
