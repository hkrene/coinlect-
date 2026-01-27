import React, { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:px-6 md:pt-32 md:pb-20">
        <div className="w-full max-w-md">
          <div className="relative p-6 overflow-hidden border glass-card sm:p-8 rounded-2xl border-white/10">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto border-b-2 rounded-full animate-spin border-coinlect-accent"></div>
              <p className="mt-4 text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
