'use client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Button from '@/components/Button';
import CheckButton from '@/components/CheckButton';
import RadioButton from '@/components/RadioButton';

export default function DemoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Demo', href: '/demo' },
  ];

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 bg-white p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <nav className="row-start-1 w-full px-8">
        {mounted && <Breadcrumb items={breadcrumbItems} />}
      </nav>
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-black">Demo Page - Test de Botones</h1>

        <Button
          variant="submit"
          paddingX={6}
          paddingY={3}
          textSize="base"
          customWidth="250px"
          customHeight="50px"
        >
          Submit Button
        </Button>

        <Button
          variant="white"
          paddingX={6}
          paddingY={3}
          textSize="base"
          customWidth="250px"
          customHeight="50px"
        >
          White Button with Blue Border
        </Button>

        <Button
          variant="submit"
          paddingX={6}
          paddingY={3}
          textSize="base"
          customWidth="250px"
          customHeight="50px"
          disabled={true}
        >
          Disabled Button
        </Button>

        <CheckButton
          initialChecked={false}
          onChange={(checked) => console.log('Checked state: ', checked)}
          text="Checkbox Text"
        />

        <RadioButton
          initialChecked={false} // Estado inicial desmarcado
          onChange={(checked) => console.log('Radio Button Checked:', checked)}
          text="Select this option"
        />

        <RadioButton
          initialChecked={true} // Estado inicial marcado
          onChange={(checked) => console.log('Radio Button Checked:', checked)}
          text="Another option"
        />
      </main>
    </div>
  );
}
