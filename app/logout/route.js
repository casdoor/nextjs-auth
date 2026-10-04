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

import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

// POST only, so another site can not log the user out with a link or an image.
export async function POST(request) {
  const response = NextResponse.redirect(new URL("/", request.nextUrl.origin), 303);
  clearSession(response, request.cookies);
  return response;
}
