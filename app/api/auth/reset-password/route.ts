import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getUserIdByResetToken, deletePasswordResetToken, updateUserPassword } from '@/lib/users-db';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = checkRateLimit(ip, 5, 15 * 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429 });
    }

    const { token, password } = await req.json();

    if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 });
    }

    // 1. Refazer o hash do token para procurar no banco
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Buscar o registro de reset
    const resetRecord = getUserIdByResetToken(tokenHash);

    if (!resetRecord) {
      return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 400 });
    }

    // 3. Verificar expiração
    if (resetRecord.expires_at < Date.now()) {
      deletePasswordResetToken(tokenHash);
      return NextResponse.json({ error: 'O token expirou. Solicite um novo link de redefinição.' }, { status: 400 });
    }

    // 4. Hash da nova senha
    const newPasswordHash = await bcrypt.hash(password, 10);

    // 5. Atualizar a senha do usuário
    updateUserPassword(resetRecord.user_id, newPasswordHash);

    // 6. Invalidar o token (usado)
    deletePasswordResetToken(tokenHash);

    return NextResponse.json({ success: true, message: 'Senha redefinida com sucesso!' });

  } catch (error) {
    console.error('[Reset Password Error]:', error);
    return NextResponse.json({ error: 'Erro ao redefinir a senha.' }, { status: 500 });
  }
}
