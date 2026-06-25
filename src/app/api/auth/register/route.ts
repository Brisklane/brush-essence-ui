import { NextRequest } from "next/server";

import { callApi, forwardAuthResult } from "@/lib/auth/bff";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const apiResponse = await callApi("/api/auth/register", {
    method: "POST",
    body,
  });
  return forwardAuthResult(apiResponse);
}
