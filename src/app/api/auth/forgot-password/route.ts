import { NextRequest } from "next/server";

import { callApi, proxyResponse } from "@/lib/auth/bff";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const apiResponse = await callApi("/api/auth/forgot-password", {
    method: "POST",
    body,
  });
  return proxyResponse(apiResponse);
}
