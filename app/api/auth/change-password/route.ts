import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { getUserByEmail, updateUserPassword } from '@/lib/users-db';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const ip = req.ip || req.headers.get('x-forwarded-for') || session.user.email;
    const isAllowed = checkRateLimit(ip, 10, 15 * 60 * 1000); // 10 attempts per 15 min
    if (!isAllowed) {
      return NextResponse.json({ error: 'Muitas tentativas de troca de senha. Bloqueado temporariamente.' }, { status: 429 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' }, { status: 400 });
    }

    const user = getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    if (!user.password) {
      // First time setting password (coming from Google Login)
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      updateUserPassword(user.id, newPasswordHash);
      return NextResponse.json({ success: true, message: 'Senha criada com sucesso!' });
    }

    // Changing existing password
    if (!currentPassword) {
      return NextResponse.json({ error: 'Você precisa informar sua senha atual.' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'A senha atual está incorreta.' }, { status: 400 });
    }

    // Atualizar
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    updateUserPassword(user.id, newPasswordHash);

    return NextResponse.json({ success: true, message: 'Senha alterada com sucesso!' });
  } catch (error) {
    console.error('[Change Password Error]:', error);
    return NextResponse.json({ error: 'Erro ao alterar a senha.' }, { status: 500 });
  }
}
