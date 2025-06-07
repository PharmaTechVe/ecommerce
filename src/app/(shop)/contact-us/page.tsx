'use client';

import { useState } from 'react';

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar el formulario a tu backend o servicio de email
    setSubmitted(true);
  };

  return (
    <main className="mx-auto mb-12 max-w-2xl p-4">
      <h1 className="mb-8 text-center text-3xl font-bold text-[#1C2143]">
        Contáctanos
      </h1>
      <div className="rounded-lg bg-white p-6 shadow">
        {submitted ? (
          <div className="space-y-6 text-center font-semibold text-green-600">
            ¡Gracias por contactarnos! Te responderemos pronto.
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Nombre
              </label>
              <input
                className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#1C2143] focus:outline-none"
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <input
                className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#1C2143] focus:outline-none"
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="message"
              >
                Mensaje
              </label>
              <textarea
                className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#1C2143] focus:outline-none"
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-[#1C2143] py-2 font-semibold text-white transition hover:bg-[#23285a]"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
