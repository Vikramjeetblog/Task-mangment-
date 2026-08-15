import { Pencil } from "lucide-react";

export default function ProfileSettingsPage() {
  return (
    <div className="p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="mb-4 font-sans text-xl font-semibold text-[var(--base-primary)]">Profile</h1>

        <div className="rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <span className="text-sm text-gray-600">Profile picture</span>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <span className="text-sm text-gray-600">Email</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">dexter@gmail.com</span>
              <Pencil className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <span className="text-sm text-gray-600">Full name</span>
            <input
              type="text"
              placeholder="Dexter"
              className="w-40 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <div>
              <p className="text-sm text-gray-600">Title</p>
              <p className="text-xs text-gray-400">Your job title or role</p>
            </div>
            <input
              type="text"
              placeholder="Designer"
              className="w-40 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="text-xs text-gray-400">One word, like a nickname or first name</p>
            </div>
            <input
              type="text"
              placeholder="Dexuser"
              className="w-40 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-400 outline-none"
            />
          </div>
        </div>

        <h2 className="mt-6 mb-2 text-sm font-medium text-[var(--base-primary)]">Workspace access</h2>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <span className="text-sm text-gray-500">Remove yourself from the workspace</span>
          <button className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50">
            Leave Workspace
          </button>
        </div>
      </div>
    </div>
  );
}