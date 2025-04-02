import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const body = await request.json();
  
  console.log(`Proxying auth request to: ${path}`, body);
  
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/${path}`;
  
  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { message: "Failed to connect to authentication server" },
      { status: 500 }
    );
  }
} 