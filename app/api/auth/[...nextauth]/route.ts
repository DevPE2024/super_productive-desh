import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Como estamos usando Supabase Auth, não precisamos do NextAuth
// Este endpoint pode ser usado para outras funcionalidades de auth se necessário
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Auth endpoint - using Supabase Auth" });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Auth endpoint - using Supabase Auth" });
}
