import { createFileRoute } from "@tanstack/react-router";
import { Search, Feather, BookOpen, Globe, Lightbulb, Code2, SearchCheck, Camera } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CHATEA — Escribe. Crea. Edita." },
      { name: "description", content: "Suite de herramientas de IA de ultra-lujo: corrección, resúmenes, traducción, ideas, código, búsqueda y edición fotográfica. Todo en un solo lugar." },
    ],
  }),
});

const tools = [
  { icon: Feather, title: "Corrector de Texto", desc: "Refina cada palabra con precisión." },
  { icon: BookOpen, title: "Resumidor", desc: "La esencia, en segundos." },
  { icon: Globe, title: "Traductor", desc: "Tu voz, en cualquier idioma." },
  { icon: Lightbulb, title: "Generador de Ideas", desc: "Inspiración bajo demanda." },
  { icon: Code2, title: "Programación", desc: "Código limpio y elegante." },
  { icon: SearchCheck, title: "Buscador Pro", desc: "Resultados curados, sin ruido." },
  { icon: Camera, title: "Editor de Fotos", desc: "Retoque con maestría." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-[Inter,sans-serif] relative overflow-hidden">
      {/* Subtle gold ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.72 0.10 80 / 0.08), transparent 70%), radial-gradient(ellipse 50% 35% at 50% 100%, oklch(0.72 0.10 80 / 0.05), transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 md:px-16 py-8">
        <h1
          className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl font-light text-foreground"
          style={{ letterSpacing: "0.45em" }}
        >
          CHATEA
        </h1>
        <div
          className="hidden md:block h-px w-24"
          style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
        />
        <span
          className="text-[0.65rem] uppercase tracking-[0.4em] text-[color:var(--gold)] font-light"
        >
          Édition Privée
        </span>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-16 md:pt-24 pb-24">
        <div
          className="mb-10 h-px w-16"
          style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
        />

        <h2
          className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl lg:text-8xl font-light text-center leading-[1.05] text-foreground"
          style={{ letterSpacing: "0.04em" }}
        >
          Escribe. <span className="italic font-extralight">Crea.</span> Edita.
        </h2>

        <p
          className="mt-8 font-[Cormorant_Garamond,serif] italic text-xl md:text-2xl text-[color:var(--gold)] tracking-wide"
        >
          Todo en un solo lugar
        </p>

        {/* Search */}
        <div className="mt-14 w-full max-w-2xl">
          <div
            className="group flex items-center gap-4 rounded-full bg-[oklch(0.08_0_0)] px-7 py-4 transition-all"
            style={{
              border: "1px solid var(--gold-soft)",
              boxShadow: "var(--shadow-luxe)",
            }}
          >
            <Search className="h-4 w-4 text-[color:var(--gold)]" strokeWidth={1.25} />
            <input
              type="text"
              placeholder="¿Qué deseas crear hoy?"
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base tracking-wide font-light"
            />
            <button
              className="text-[0.7rem] uppercase tracking-[0.3em] text-[color:var(--gold)] hover:text-foreground transition-colors font-light"
            >
              Iniciar
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-24 mb-14 flex items-center gap-6 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold-soft))" }} />
          <span className="text-[0.6rem] uppercase tracking-[0.5em] text-[color:var(--gold)]">Herramientas</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--gold-soft), transparent)" }} />
        </div>

        {/* Tools grid */}
        <section className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tools.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group relative rounded-sm bg-[oklch(0.08_0_0)] p-8 cursor-pointer transition-all duration-500 hover:bg-[oklch(0.10_0_0)]"
              style={{ border: "1px solid oklch(0.72 0.10 80 / 0.18)" }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
              />
              <Icon
                className="h-7 w-7 text-[color:var(--gold)] mb-6 transition-transform duration-500 group-hover:-translate-y-0.5"
                strokeWidth={1}
              />
              <h3
                className="font-[Cormorant_Garamond,serif] text-xl text-foreground font-light mb-2"
                style={{ letterSpacing: "0.05em" }}
              >
                {title}
              </h3>
              <p className="text-xs text-muted-foreground font-light tracking-wide leading-relaxed">
                {desc}
              </p>
              <span
                className="mt-6 inline-block text-[0.6rem] uppercase tracking-[0.35em] text-[color:var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                Explorar →
              </span>
            </article>
          ))}
        </section>

        <footer className="mt-24 text-center">
          <div
            className="mx-auto mb-4 h-px w-12"
            style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
          />
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground font-light">
            CHATEA · Maison Numérique · MMXXVI
          </p>
        </footer>
      </main>
    </div>
  );
}
