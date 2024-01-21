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
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LoginCallback = (params) => {
  const router = useRouter();
  const searchParams = params.searchParams;
  const code = searchParams.code;
  const state = searchParams.state;

  const setCookie = async () => {
    const response = await fetch(`/api/login?code=${code}&state=${state}`);
    if (response.ok == true) {
      const user = await response.json();
      Cookies.set("casdoorUser", JSON.stringify(user));
      router.push("/profile");
    } else {
      console.error("Error:", response.error);
    }
  };

  setCookie();
};

export default LoginCallback;
