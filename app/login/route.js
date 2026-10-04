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
import { codeChallenge, getAuthorizeUrl, randomString } from "@/lib/casdoor";
import { OAUTH_COOKIE, safeReturnTo } from "@/lib/session";

export async function GET(request) {
  const { origin, searchParams } = request.nextUrl;
  const state = randomString();
  const verifier = randomString();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));

  const response = NextResponse.redirect(getAuthorizeUrl({
    redirectUri: `${origin}/callback`,
    state,
    challenge: await codeChallenge(verifier),
  }));
  response.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, verifier, returnTo }), {
    httpOnly: true,
    secure: origin.startsWith("https:"),
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
