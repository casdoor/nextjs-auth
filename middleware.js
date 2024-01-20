import { NextResponse } from "next/server";

const protectedRoutes = ["/profile"];

export default function middleware(req) {
  const casdoorUserCookie = req.cookies.get("casdoorUser");
  const isAuthenticated = casdoorUserCookie ? true : false;

  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    const casdoorLoginURL = `${
      process.env.CASDOOR_ENDPOINT
    }/login/oauth/authorize?client_id=${
      process.env.NEXT_PUBLIC_CASDOOR_CLIENT_ID
    }&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.CASDOOR_REDIRECT_URI
    )}&scope=read&state=${process.env.CASDOOR_APPLICATION_NAME}`;

    return NextResponse.redirect(casdoorLoginURL);
  }
}

