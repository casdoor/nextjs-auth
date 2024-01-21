// Copyright 2024 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
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
      <div className="container">
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
              <td>
                <img src={userJson.avatar}></img>
              </td>
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
      </div>
    </>
  );
}
