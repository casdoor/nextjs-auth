// Copyright 2026 The Casdoor Authors. All Rights Reserved.
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

// The session is the Casdoor access token in httpOnly cookies. Every request verifies its
// signature with the keys of Casdoor, so no session secret or store is needed. A token can be
// larger than the 4KB a cookie holds, so it is split into chunks.
const SESSION_COOKIE = "casdoor_session";
const CHUNK_SIZE = 3500;
const MAX_CHUNKS = 8;

// The state, PKCE verifier and return path of a login in progress.
export const OAUTH_COOKIE = "casdoor_oauth";

function chunkName(i) {
  return `${SESSION_COOKIE}.${i}`;
}

// cookies: request.cookies or the result of cookies() from next/headers
export function readSession(cookies) {
  let token = "";
  for (let i = 0; i < MAX_CHUNKS; i++) {
    const chunk = cookies.get(chunkName(i));
    if (!chunk) {
      break;
    }
    token += chunk.value;
  }
  return token;
}

export function writeSession(response, requestCookies, token, { secure, maxAge }) {
  const chunks = token.match(new RegExp(`.{1,${CHUNK_SIZE}}`, "g")) || [];
  if (chunks.length > MAX_CHUNKS) {
    throw new Error("the access token is too large to keep in cookies");
  }

  chunks.forEach((chunk, i) => {
    response.cookies.set(chunkName(i), chunk, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge });
  });
  for (let i = chunks.length; i < MAX_CHUNKS; i++) {
    if (requestCookies.has(chunkName(i))) {
      response.cookies.delete(chunkName(i));
    }
  }
}

export function clearSession(response, requestCookies) {
  for (let i = 0; i < MAX_CHUNKS; i++) {
    if (requestCookies.has(chunkName(i))) {
      response.cookies.delete(chunkName(i));
    }
  }
}

// Only paths of this site, so the login can not be used to redirect to another site.
export function safeReturnTo(path) {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\") ? path : "/profile";
}
