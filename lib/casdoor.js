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

import { base64url, createRemoteJWKSet, jwtVerify } from "jose";
import conf from "@/app/conf";

// The public keys Casdoor signs the tokens with, fetched once and cached.
const jwks = createRemoteJWKSet(new URL(`${conf.serverUrl}/.well-known/jwks`));

export function randomString() {
  return base64url.encode(crypto.getRandomValues(new Uint8Array(32)));
}

export async function codeChallenge(verifier) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url.encode(new Uint8Array(digest));
}

export function getAuthorizeUrl({ redirectUri, state, challenge }) {
  const params = new URLSearchParams({
    client_id: conf.clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return `${conf.serverUrl}/login/oauth/authorize?${params}`;
}

// Exchange the authorization code on the server, the browser never sees the token response.
export async function exchangeCode({ code, verifier, redirectUri }) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: conf.clientId,
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
  });
  if (conf.clientSecret) {
    body.set("client_secret", conf.clientSecret);
  }

  const res = await fetch(`${conf.serverUrl}/api/login/oauth/access_token`, { method: "POST", body, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) {
    throw new Error(data.error_description || data.error || `token request failed with status ${res.status}`);
  }
  return data;
}

// Returns the claims of a valid access token issued to this application, null otherwise.
export async function verifyToken(token) {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer: conf.issuer, audience: conf.clientId });
    return payload;
  } catch {
    return null;
  }
}

export async function getUserinfo(token) {
  const res = await fetch(`${conf.serverUrl}/api/userinfo`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json().catch(() => null);
}
