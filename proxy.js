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
import { verifyToken } from "@/lib/casdoor";
import { readSession } from "@/lib/session";

// The pages that need a logged-in user. The session is verified, not just looked up, so a
// cookie made up by the browser does not get in.
export const config = {
  matcher: ["/profile/:path*"],
};

export async function proxy(request) {
  const claims = await verifyToken(readSession(request.cookies));
  if (claims) {
    return NextResponse.next();
  }

  const login = new URL("/login", request.nextUrl.origin);
  login.searchParams.set("returnTo", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}
