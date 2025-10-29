import { NextResponse } from 'next/server';

// GET - Health check da API da Comunidade
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'API da Comunidade está funcionando!',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}

