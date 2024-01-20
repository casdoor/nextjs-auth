"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LoginCallback = (params) => {
  const router = useRouter();
  const searchParams = params.searchParams;
  const code = searchParams.code;
  const state = searchParams.state;

  const setCookie = async () => {
    const response = await fetch(`/api/login?code=${code}&state=${state}`);
    if (response.ok == true) {
      const user = await response.json();
      Cookies.set("casdoorUser", JSON.stringify(user));
      router.push("/profile");
    } else {
      console.error("Error:", response.error);
    }
  };

  setCookie();
};

export default LoginCallback;
