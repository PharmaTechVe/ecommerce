'use client';

export default function AboutUsPage() {
  return (
    <main className="mx-auto mb-12 max-w-7xl p-4">
      <section className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-4xl font-bold text-[#1C2143]">
          Sobre Pharmatech
        </h1>
        <div className="mb-8 flex justify-center">
          <span className="inline-block h-1 w-24 rounded bg-[#1C2143]" />
        </div>
        <p className="mb-6 text-center text-lg text-gray-700">
          Somos una plataforma de e-commerce farmacéutico que conecta a los
          clientes con medicamentos y productos de salud de forma ágil, segura y
          eficiente. Centralizamos la gestión de inventarios y automatizamos la
          logística para que tu experiencia de compra sea simple y confiable.
        </p>

        <div className="mb-10 flex flex-col gap-8 md:flex-row">
          <div className="flex-1 rounded-lg bg-[#F1F5FD] p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-[#1C2143]">
              Misión
            </h2>
            <p className="text-sm text-gray-700">
              Ofrecer una experiencia de compra online ágil y segura,
              garantizando la disponibilidad y entrega eficiente de productos
              farmacéuticos bajo estrictos estándares legales y sanitarios.
            </p>
          </div>
          <div className="flex-1 rounded-lg bg-[#F1F5FD] p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-[#1C2143]">
              Visión
            </h2>
            <p className="text-sm text-gray-700">
              Ser la plataforma líder en Venezuela, reconocida por innovación,
              confiabilidad y excelencia en el servicio farmacéutico digital.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-[#1C2143]">
            ¿Por qué elegirnos?
          </h2>
          <ul className="grid list-disc gap-3 pl-5 text-sm text-gray-700 md:grid-cols-2">
            <li>Gestión centralizada y precisa de inventarios.</li>
            <li>Procesos logísticos automatizados y entrega rápida.</li>
            <li>Plataforma intuitiva y segura para tus compras.</li>
            <li>Cumplimiento estricto de normativas legales y sanitarias.</li>
            <li>Soporte y atención personalizada.</li>
            <li>Innovación y mejora continua.</li>
          </ul>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="rounded-full bg-[#1C2143] p-4 shadow-md">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 10.9 12 12 12 13h-2v-.5c0-1 .45-1.99 1.17-2.71l1.24-1.26A2 2 0 1010 7h2a4 4 0 01-1.93 7.45z"
              />
            </svg>
          </div>
        </div>
      </section>
    </main>
  );
}
