"use client";
import Image from "next/image";
import { setChatData } from "@/app/redux/slices/chatSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import clsx from "clsx";
import { ChatListItemModel } from "@/app/redux/slices/chatListSlice";
import {
  setActiveComponent,
  setFriendStatus,
} from "@/app/redux/slices/componentSlice";
import { LuImage } from "react-icons/lu";
import { FaRegFile } from "react-icons/fa";
import { getFileNameAndUrl } from "@/lib/utils";
import { MdBlock } from "react-icons/md";

interface ChatListItemProps {
  chatList: ChatListItemModel;
  highlight?: boolean;
  selected?: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chatList,
  highlight,
  selected,
  onClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const openMessageBox = () => {
    dispatch(
      setChatData({
        user_email: chatList.user_email,
        user_name: chatList.user_name,
        user_photo: chatList.user_photo,
        room_id: chatList.room_id,
        friend_status: chatList.friend_status,
        createdAt: chatList.createdAt,
        activeStatus: chatList.activeStatus,
      })
    );
    dispatch(setActiveComponent("chat"));
    dispatch(setFriendStatus(chatList.friend_status));

    onClick();
  };

  const renderMessageContent = () => {
    if (chatList.message_deleted_at) {
      return (
        <div className="flex items-center gap-2">
          <span>Message deleted.</span>
        </div>
      );
    }

    if (chatList.message_type === "photo") {
      return (
        <div className="flex items-center gap-1">
          <LuImage className="h-4 w-4" /> <span>Image</span>
        </div>
      );
    }

    if (chatList.message_type === "file") {
      const { fileName } = getFileNameAndUrl(chatList.last_message);

      if (fileName) {
        const fileExtension = fileName.slice(fileName.lastIndexOf("."));
        const truncatedFileName = fileName.slice(0, 9) + ".." + fileExtension;

        return (
          <div className="flex items-center gap-1">
            <FaRegFile className="h-4 w-4" /> <span>{truncatedFileName}</span>
          </div>
        );
      }
    }

    if (chatList.message_type === "text") {
      return (
        <span>
          {chatList.last_message.length >= 15
            ? chatList.last_message.substring(0, 15) + "..."
            : chatList.last_message}
        </span>
      );
    }

    return null;
  };

  return (
    <div
      onClick={openMessageBox}
      className={clsx(
        "gap-4 py-2 lg:py-2.5 px-3 border-l-2 rounded-lg   border-transparent hover:bg-default-200 cursor-pointer flex transition-all duration-500",
        { "": highlight }
      )}
    >
      <div className="flex-1 flex  gap-3 ">
        <div className="relative inline-block ">
          <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <Image
              width={40}
              height={40}
              className="aspect-square h-full w-full"
              src={
                chatList.friend_status === "friend" ||
                chatList.friend_status === "unfriend"
                  ? chatList.user_photo ?? "/profile-circle.svg"
                  : "/profile-circle.svg"
              }
              alt="tst"
              loading="eager"
            />
          </span>
          {(chatList.friend_status === "friend" ||
            chatList.friend_status === "unfriend") && (
            <>
              {chatList.activeStatus ? (
                <span className="inline-flex rounded-full h-2 w-2 p-0 ring-1 ring-border ring-green-500 items-center justify-center absolute left-[calc(100%-8px)] top-[calc(100%-10px)] bg-green-500" />
              ) : (
                <div className="inline-flex rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-success border-transparent text-success-foreground h-2 w-2 p-0 ring-1 ring-border ring-offset-[1px] items-center justify-center absolute left-[calc(100%-8px)] top-[calc(100%-10px)]"></div>
              )}
            </>
          )}
        </div>
        <div className="block">
          <div className="truncate max-w-[120px]">
            <span
              className={clsx(
                "text-sm text-gray-300 font-medium transition-all duration-500 ease-in-out",
                {
                  "font-bold text-white": highlight || selected,
                }
              )}
            >
              {" "}
              {chatList.user_name}
            </span>
          </div>
          <div className="truncate max-w-[120px]">
            <span
              className={clsx(
                "text-xs text-[#5C6B81] transition-all duration-500 ease-in-out",
                {
                  "text-[#fff]": highlight || selected,
                }
              )}
            >
              {renderMessageContent()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-none  flex-col items-end  gap-2 hidden lg:flex">
        <span className="text-xs text-white text-end uppercase ">
          {chatList.updatedAt &&
            new Date(chatList.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
        </span>
        {highlight && (
          <span className=" flex items-center  text-[#fff] justify-center bg-default-400 rounded-full text-[8px] font-light tracking-widest">
            NEW
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
