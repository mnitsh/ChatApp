import React, { useEffect, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import "./styles/scrollbar.css";

function Sidebar() {
  const { getUser, users, selectedUser, setSelectedUser, isUsersLoding } =
    useChatStore();
  const { onlineUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const filteredUser = showOnlineOnly
    ? users.filter((user) => onlineUser.includes(user._id))
    : users;

  if (isUsersLoding) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-3">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUser.length - 1})
          </span>
        </div>

      </div>
      <div className="overflow-y-auto w-full py-3 no-scrollbar">
        {filteredUser.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user?.profilePic || "./avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUser.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* user info - only visible on larger screen */}

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div>{onlineUser.includes(user._id) ? "Online" : "offline"}</div>
            </div>
          </button>
        ))}
        {
          filteredUser.length === 0 && (<div className="text-center py-4 text-zinc-500">No online users</div>)
        }
      </div>
    </aside>
  );
}

export default Sidebar;
