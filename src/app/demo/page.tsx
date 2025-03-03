'use client';

import React from 'react';
import CheckButton from '@/components/CheckButton';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Demo del CheckButton
        </h1>
      </div>
      <CheckButton text="Press me" />
      <RadioButton text="helloww" />

      <div className="mt-4">
        <Button
          variant="submit"
          paddingX={6}
          paddingY={3}
          textSize="base"
          width="250px"
          height="50px"
        >
          Submit Button
        </Button>
      </div>
    </div>
  );
};

export default Page;
