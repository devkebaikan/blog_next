import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedPaths = [
  /^auth\/.+$/,
  /^otp$/,
  /^logout$/,
  /^dashboard\/.+$/,
  /^blogs?(\/.*)?$/,
  /^events?(\/.*)?$/,
  /^programs?(\/.*)?$/,
  /^payment\/.+$/,
  /^transactions?(\/.*)?$/,
  /^discount\/.+$/,
  /^validate-token$/,
  /^users?(\/.*)?$/,
  /^profile(\/.*)?$/,
  /^categories(\/.*)?$/,
  /^tags?(\/.*)?$/,
  /^comments?(\/.*)?$/,
  /^submission(\/.*)?$/,
];

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> | { path?: string[] } }
) {
  const params = await context.params;
  const pathSegments = params.path ?? [];
  const path = Array.isArray(pathSegments) ? pathSegments.join("/") : pathSegments;

  if (!allowedPaths.some((pattern) => pattern.test(path))) {
    return NextResponse.json(
      { message: "Endpoint tidak diizinkan" },
      { status: 404 }
    );
  }

  const baseUrl =
    process.env.INTERNAL_API_URL ||
    process.env.API_URL ||
    process.env.PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://fapi.beramalbersama.com/api/v1";

  const clientKey =
    process.env.CLIENT_KEY ||
    process.env.INTERNAL_CLIENT_KEY ||
    process.env.PUBLIC_CLIENT_KEY ||
    process.env.NEXT_PUBLIC_CLIENT_KEY ||
    "bJhv2hJD&:7?b)gTJKCMtrx>iPqD%(7b";

  if (!baseUrl || !clientKey) {
    return NextResponse.json(
      { message: "Konfigurasi server belum lengkap" },
      { status: 500 }
    );
  }

  const token = request.cookies.get("authToken")?.value;
  const headers = new Headers({
    Accept: "application/json",
    "X-Client-Key": clientKey,
  });

  const contentType = request.headers.get("Content-Type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  } else if (request.method !== "GET" && request.method !== "HEAD") {
    headers.set("Content-Type", "application/json");
  }

  const authorization = request.headers.get("Authorization");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else if (authorization) {
    headers.set("Authorization", authorization);
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(`${baseUrl.replace(/\/+$/, "")}/${path}`);
  upstreamUrl.search = incomingUrl.search;

  try {
    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const response = await fetch(upstreamUrl.toString(), {
      method: request.method,
      headers,
      body,
    });

    const responseData = await response.arrayBuffer();
    const responseHeaders = new Headers();

    const responseContentType = response.headers.get("Content-Type");
    if (responseContentType) {
      responseHeaders.set("Content-Type", responseContentType);
    }

    return new Response(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err?.message ?? "Gagal terhubung ke server backend",
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const HEAD = handleProxy;
export const OPTIONS = handleProxy;
