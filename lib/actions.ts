'use server';

import { createUserWithPassword, getUserByEmail } from './users-db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' };
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return { error: 'Este e-mail já está cadastrado.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const optIn = formData.get('marketing_opt_in') === 'on' ? 1 : 0;
  createUserWithPassword(email, hashedPassword, name, optIn);

  redirect('/auth/signin?success=signup');
}

