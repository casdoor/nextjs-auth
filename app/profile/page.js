"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Page() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("casdoorUser");
    router.push("/");
  };
  return (
    <>
      <h1>Hello, Profile page!</h1>
      <button onClick={handleLogout}>logout</button>
    </>
  );
}
