"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "@/app/global.css";

export default function Page() {
  const router = useRouter();
  const user = Cookies.get("casdoorUser");
  const userJson = user ? JSON.parse(user) : {};
  const handleLogout = () => {
    Cookies.remove("casdoorUser");
    router.push("/");
  };
  return (
    <>
      <h1>Hello {userJson.name}!</h1>
      <hr />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>user name</td>
            <td>{userJson.name}</td>
          </tr>
          <tr>
            <td>user avatar</td>
            <td>{userJson.avatar}</td>
          </tr>
          <tr>
            <td>user id</td>
            <td>{userJson.sub}</td>
          </tr>
          <tr>
            <td>user owner</td>
            <td>{userJson.owner}</td>
          </tr>
          <tr>
            <td>user created time</td>
            <td>{userJson.createdTime}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <button onClick={handleLogout}>logout</button>
    </>
  );
}
