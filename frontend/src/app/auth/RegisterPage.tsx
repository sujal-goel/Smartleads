import React from 'react';
import { Zap } from 'lucide-react';
import { RegisterForm } from '@/app/auth/components/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/30">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Start managing your leads today</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/60 dark:bg-gray-800 dark:shadow-black/30">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};
