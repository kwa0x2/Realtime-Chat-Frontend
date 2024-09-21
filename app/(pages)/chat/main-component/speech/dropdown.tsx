import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useState } from "react";
  import { PiDotsThreeCircleLight } from "react-icons/pi";
  import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
  import { AiOutlineDelete } from "react-icons/ai";
  import { Message } from "@/models/Message";
  import { toast } from "sonner";
  import { deleteById } from "@/app/api/services/message.Service";
  import { Socket } from "socket.io-client";
import { MessageItemSliceModel } from "@/app/redux/slices/messageBoxSlice";

  interface DropdownProps {
    isLeftMode?: boolean;
    msg: Message;
    onEdit: () => void;
    socket: Socket | null;
    user: any;
    friend: MessageItemSliceModel;

  }
  
  const Dropdown = ({ isLeftMode = false, msg, onEdit, socket, user, friend }: DropdownProps) => {
    const [dropdown, setDropdown] = useState<boolean>(false);
  
    const handleDelete = async () => {
      // const res = await deleteById(msg.message_id);
  
      // if (res.status !== 200) {
      //   toast("Mesaj silinirken bir hata oluştu.");
      //   console.error(res);
      // } else {
      //   onDelete(msg.message_id); 
      // }

      if (socket && user) {
        let message_id = msg.message_id
        let other_user_email= friend.other_user_email
        let room_id= friend.room_id

        socket.emit("deleteMessage", {
          message_id,
          room_id,
          other_user_email,
        });        
      }
    };

    return (
      <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
        <DropdownMenuTrigger className="outline-none">
          <PiDotsThreeCircleLight className="text-[#4A32B0] text-[2rem]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="backdrop-blur-2xl">
          {isLeftMode && (
            <DropdownMenuItem onClick={handleDelete}>
              <AiOutlineDelete className="mr-2 h-4 w-4 text-rose-700" />
              <span>Benden Sil</span>
            </DropdownMenuItem>
          )}
          {!isLeftMode && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <MdOutlineDriveFileRenameOutline className="mr-2 text-yellow-600 h-4 w-4" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>
                <AiOutlineDelete className="mr-2 h-4 w-4 text-rose-700" />
                <span>Sil</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default Dropdown;
  