import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Balance from "./(money-management)/balance/page";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  const { user_name, currency } = { user_name: "Serhii", currency: "$" };
  let signedIn = false;

  if (!signedIn) {
    return (
      <>
        <LoginButton>
          <Button variant="secondary" size="lg">
            Sign In
          </Button>
        </LoginButton>
      </>
    );
  }
  redirect("/money-management");
  // return (
  //   <>
  //     <div id="welcomeMessage">Welcome back, {user_name}!</div>
  //     <Balance user_id={1} />
  //   </>
  // );
}
