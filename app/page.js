"use client";
import Link from "next/link";

export default function Page(params) {
  return (
    <>
      <h1>Hello, Home page!</h1>
      <Link href="/profile">Profile</Link>
    </>
  );
}
