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

import { NextResponse } from "next/server";
import { exchangeCode, verifyToken } from "@/lib/casdoor";
import { OAUTH_COOKIE, safeReturnTo, writeSession } from "@/lib/session";

function readLogin(request) {
  try {
    return JSON.parse(request.cookies.get(OAUTH_COOKIE)?.value || "");
  } catch {
    return null;
  }
}

export async function GET(request) {
  const { origin, searchParams } = request.nextUrl;
  const login = readLogin(request);

  const fail = (error) => {
    const response = NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, origin));
    response.cookies.delete(OAUTH_COOKIE);
    return response;
  };

  const code = searchParams.get("code");
  // The login must have been started in this browser, otherwise a code of another user
  // could be used to log the visitor in (login CSRF).
  if (!login || !code || !login.state || searchParams.get("state") !== login.state) {
    return fail("The login was not started in this browser or has expired, please try again.");
  }

  let tokens;
  try {
    tokens = await exchangeCode({ code, verifier: login.verifier, redirectUri: `${origin}/callback` });
  } catch (e) {
    return fail(e.message);
  }

  const claims = await verifyToken(tokens.access_token);
  if (!claims) {
    return fail("The access token from Casdoor is invalid.");
  }

  const response = NextResponse.redirect(new URL(safeReturnTo(login.returnTo), origin));
  response.cookies.delete(OAUTH_COOKIE);
  try {
    writeSession(response, request.cookies, tokens.access_token, {
      secure: origin.startsWith("https:"),
      maxAge: Math.max(0, claims.exp - Math.floor(Date.now() / 1000)),
    });
  } catch (e) {
    return fail(e.message);
  }
  return response;
}
