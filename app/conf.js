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

// Only used on the server. The defaults point to the Casdoor demo site, set the
// environment variables to use your own Casdoor.
const serverUrl = (process.env.CASDOOR_SERVER_URL || "https://door.casdoor.com").replace(/\/+$/, "");

const conf = {
  serverUrl,
  clientId: process.env.CASDOOR_CLIENT_ID || "294b09fbc17f95daf2fe",
  // Optional: the login uses PKCE, so a public application needs no secret.
  clientSecret: process.env.CASDOOR_CLIENT_SECRET || "",
  // The "iss" of the tokens, it is the server URL unless Casdoor has another origin configured.
  issuer: (process.env.CASDOOR_ISSUER || serverUrl).replace(/\/+$/, ""),
};

export default conf;
