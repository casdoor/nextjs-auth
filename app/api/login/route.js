import axios from "axios";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const  code = searchParams.get("code");

  const tokenConfig = {
    method: "POST",
    url: `${process.env.CASDOOR_ENDPOINT}/api/login/oauth/access_token`,
    data: {
      code: code,
      grant_type: "authorization_code",
      client_secret: process.env.NEXT_PUBLIC_CASDOOR_CLIENT_SECRET,
      client_id: process.env.NEXT_PUBLIC_CASDOOR_CLIENT_ID,
    },
  };

  try {
    const response = await axios(tokenConfig);
    const token = response.data.access_token;
    const decodeToken = jwt.decode(token);

    return Response.json(decodeToken);
  } catch (error) {
    console.error("Error getting access token:", error.message);
  }
}
