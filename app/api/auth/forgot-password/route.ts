import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUserByEmail, createPasswordResetToken } from '@/lib/users-db';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    // Limite: 5 requisições por 15 minutos por IP
    const isAllowed = checkRateLimit(ip, 5, 15 * 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429 });
    }

    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    const user = getUserByEmail(email);

    // Sempre retornamos sucesso para prevenir "Email Enumeration Attack"
    // Se o usuário não existir, simplesmente não fazemos nada.
    if (user) {
      // 1. Gerar token criptograficamente seguro (32 bytes)
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // 2. Fazer o hash do token para salvar no banco (SHA-256)
      // Se o banco vazar, os hackers não têm o token real.
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      // 3. Expiração: 1 hora a partir de agora
      const expiresAt = Date.now() + 60 * 60 * 1000;

      // 4. Salvar no banco
      createPasswordResetToken(user.id, tokenHash, expiresAt);

      // 5. Montar o Link Mágico
      const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
      const resetLink = `${appUrl}/auth/reset-password?token=${resetToken}`;

      // TODO: Quando o serviço de e-mail (Resend, SendGrid) for configurado, disparar aqui.
      console.log('\n=============================================');
      console.log('🔒 LINK DE RECUPERAÇÃO DE SENHA GERADO:');
      console.log(`E-mail: ${email}`);
      console.log(`Link: ${resetLink}`);
      console.log('=============================================\n');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Se o e-mail estiver cadastrado, você receberá um link de redefinição em instantes.' 
    });

  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    return NextResponse.json({ error: 'Erro ao processar a solicitação.' }, { status: 500 });
  }
}
