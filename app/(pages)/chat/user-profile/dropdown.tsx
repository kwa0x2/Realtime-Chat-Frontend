"use client";
import { logoutAction } from "@/actions/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { setActiveComponent } from "@/app/redux/slices/componentSlice";
import { useRouter } from 'next/navigation';

interface DropDownProbs {
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;

}


const Dropdown = ({setIsOpenChatList}: DropDownProbs) => {
  const dispatch = useDispatch<AppDispatch>();
  const [dropdown, setDropdown] = useState<boolean>(false);
  const router = useRouter(); 

  const clickHandler = (action: () => void) => {
    setDropdown(false);
    action();
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push('/'); 
  };

  return (
    <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
      <DropdownMenuTrigger className="outline-none">
        <PiDotsThreeCircleLight className="text-[#4A32B0] text-[2rem]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => clickHandler(() => {dispatch(setActiveComponent("profile")); setIsOpenChatList(false)})}>
          <User className="mr-2 h-4 w-4 text-blue-500" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => clickHandler(() => {dispatch(setActiveComponent("friends")); setIsOpenChatList(false)})}>
          <UserRoundPlus className="mr-2 h-4 w-4 text-green-600" />
          Friends
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4 text-rose-700" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
