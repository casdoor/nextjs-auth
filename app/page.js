"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/profile");
  };
  return (
    <>
      <h1>Casdoor Nextjs-Auth example</h1>
      <button onClick={handleLogin}>login</button>
    </>
  );
}
