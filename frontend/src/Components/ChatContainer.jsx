import React, { useEffect, useRef } from "react";
import { useChatStore } from "../Store/useChatStore";
import MessageSkeleton from "../Components/skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../Store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import "./styles/scrollbar.css";

function ChatContainer() {
  const { messages, isMessagesLoding, selectedUser, getMessage } =
    useChatStore();
  const { authUser } = useAuthStore();

  const chatEndRef = useRef(null);

  useEffect(() => {
    getMessage(selectedUser._id);
  }, [getMessage, selectedUser._id]);


  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages]); 

  if (isMessagesLoding)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <ChatHeader />
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderID === authUser.data._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderID === authUser.data._id
                      ? authUser?.data.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                ></img>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div >
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
