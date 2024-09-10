"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
    const router = useRouter();

    if (mode === "modal"){
        return (<span>TODO implement modal</span>);
    }
  return <span className="cursor-pointer mt-[200px] w-full flex justify-center items-center" onClick = {()=>router.push("/login")}>{children}</span>;

};
