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
import axios from "axios";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const tokenConfig = {
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login/oauth/access_token`,
    data: {
      code: code,
      grant_type: "authorization_code",
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    },
  };

  try {
    const response = await axios(tokenConfig);
    const token = response.data.access_token;
    const decodeToken = jwt.decode(token);

    return Response.json({decodeToken});
  } catch (error) {
    console.error("Error getting access token:", error.message);
  }
}
