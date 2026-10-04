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

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserinfo, verifyToken } from "@/lib/casdoor";
import { readSession } from "@/lib/session";

export default async function Page() {
  const token = readSession(await cookies());
  const claims = await verifyToken(token);
  if (!claims) {
    redirect("/login?returnTo=/profile");
  }

  // The user as Casdoor has it now, the claims of the token are the fallback.
  const user = (await getUserinfo(token)) || {};
  const username = user.preferred_username || claims.name;
  const displayName = user.name || claims.displayName || username;
  const avatar = user.picture || claims.avatar;

  return (
    <div className="container">
      <h1>Hello {displayName}!</h1>
      <hr />
      <table>
        <tbody>
          <tr>
            <td>Username</td>
            <td>{username}</td>
          </tr>
          <tr>
            <td>Display Name</td>
            <td>{displayName}</td>
          </tr>
          <tr>
            <td>Organization</td>
            <td>{claims.owner}</td>
          </tr>
          <tr>
            <td>User ID</td>
            <td>{claims.sub}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email || claims.email}</td>
          </tr>
          <tr>
            <td>Avatar</td>
            {/* eslint-disable-next-line @next/next/no-img-element -- avatars are on any host */}
            <td>{avatar && <img src={avatar} alt="avatar" width={64} height={64} />}</td>
          </tr>
          <tr>
            <td>Session expires</td>
            <td>{new Date(claims.exp * 1000).toISOString()}</td>
          </tr>
        </tbody>
      </table>
      <form action="/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
