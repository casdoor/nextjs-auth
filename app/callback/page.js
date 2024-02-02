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

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Sdk from "casdoor-js-sdk";
import sdkConfig from "@/app/conf";

export const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const CasdoorSDK = new Sdk(sdkConfig);

    const additionalParams = {
      client_secret: "dd8982f7046ccba1bbd7851d5c1ece4e52bf039d",
    };

    CasdoorSDK.exchangeForAccessToken(additionalParams)
      .then((res) => {
        if (res && res.access_token) {
          return CasdoorSDK.getUserInfo(res.access_token);
        }
      })
      .then((res) => {
        const casdoorUserInfo = res;
        Cookies.set("casdoorUser", JSON.stringify(casdoorUserInfo));
        router.push("/profile");
      })
      .catch((error) => {
        console.error("Failed to get access_token:", error);
        router.push("/");
      });
  }, []);
  
  return <div>signing...</div>;
};

export default AuthCallback;
