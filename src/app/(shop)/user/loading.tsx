import React from 'react';
import Loader from '@/components/Loader';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader />
    </div>
  );
}
