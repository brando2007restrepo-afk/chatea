import { createFileRoute } from "@tanstack/react-router";
import { Search, Feather, BookOpen, Globe, Lightbulb, Code2, SearchCheck, Camera, Upload } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { runGemini } from "@/lib/gemini.functions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CHATEA — Escribe. Crea. Edita." },
      { name: "description", content: "Suite de herramientas de IA de ultra-lujo: corrección, resúmenes, traducción, ideas, código, búsqueda y edición fotográfica. Todo en un solo lugar." },
    ],
  }),
});

type ToolId = "corrector" | "resumidor" | "traductor" | "ideas" | "codigo" | "buscador" | "foto";

const tools: Array<{
  id: ToolId;
  icon: typeof Feather;
  title: string;
  desc: string;
  placeholder: string;
  needsLanguage?: boolean;
  disabled?: boolean;
}> = [
  { id: "corrector", icon: Feather, title: "Corrector de Texto", desc: "Refina cada palabra con precisión.", placeholder: "Pega aquí el texto a corregir…" },
  { id: "resumidor", icon: BookOpen, title: "Resumidor", desc: "La esencia, en segundos.", placeholder: "Pega el texto que deseas resumir…" },
  { id: "traductor", icon: Globe, title: "Traductor", desc: "Tu voz, en cualquier idioma.", placeholder: "Texto a traducir…", needsLanguage: true },
  { id: "ideas", icon: Lightbulb, title: "Generador de Ideas", desc: "Inspiración bajo demanda.", placeholder: "Describe el tema o reto…" },
  { id: "codigo", icon: Code2, title: "Programación", desc: "Código limpio y elegante.", placeholder: "Describe lo que necesitas programar…" },
  { id: "buscador", icon: SearchCheck, title: "Buscador Pro", desc: "Resultados curados, sin ruido.", placeholder: "¿Qué quieres investigar?" },
  { id: "foto", icon: Camera, title: "Editor de Fotos", desc: "Carga una imagen para comenzar.", placeholder: "" },
];

function Index() {
  const [active, setActive] = useState<(typeof tools)[number] | null>(null);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("Inglés");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoDragging, setPhotoDragging] = useState(false);
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const callGemini = useServerFn(runGemini);

  const openTool = (t: (typeof tools)[number]) => {
    if (t.disabled) return;
    setActive(t);
    setInput("");
    setOutput("");
    setError(null);
  };

  const submit = async () => {
    if (!active || active.id === "foto") return;
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await callGemini({
        data: {
          toolId: active.id,
          input: input.trim(),
          extra: active.needsLanguage ? language : undefined,
        },
      });
      if (res.ok) setOutput(res.text || "(sin respuesta)");
      else setError(res.error);
    } catch (e) {
      setError("Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

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
              className="text-[0.7rem] uppercase tracking-[0.3em] text-[color:var(--gold)] hover:text-foreground transition-all duration-500 font-light"
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
          {tools.map((t) => (
            <article
              key={t.id}
              onClick={() => openTool(t)}
              className="group relative rounded-sm bg-[oklch(0.08_0_0)] p-8 transition-all duration-500 cursor-pointer hover:bg-[oklch(0.10_0_0)]"
              style={{ border: "1px solid oklch(0.72 0.10 80 / 0.18)" }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
              />
              <t.icon
                className="h-7 w-7 text-[color:var(--gold)] mb-6 transition-transform duration-500 group-hover:-translate-y-0.5"
                strokeWidth={1}
              />
              <h3
                className="font-[Cormorant_Garamond,serif] text-xl text-foreground font-light mb-2"
                style={{ letterSpacing: "0.05em" }}
              >
                {t.title}
              </h3>
              <p className="text-xs text-muted-foreground font-light tracking-wide leading-relaxed">
                {t.desc}
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

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className="max-w-2xl bg-[oklch(0.07_0_0)] text-foreground"
          style={{ border: "1px solid var(--gold-soft)" }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-[Cormorant_Garamond,serif] text-2xl font-light"
              style={{ letterSpacing: "0.08em" }}
            >
              {active?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs tracking-wide">
              {active?.desc}
            </DialogDescription>
          </DialogHeader>

          {active?.id === "foto" ? (
            <div className="py-6">
              <label
                htmlFor="chatea-photo-upload"
                className="flex flex-col items-center justify-center gap-4 py-16 rounded-sm cursor-pointer transition-colors hover:bg-[oklch(0.05_0_0)]"
                style={{ border: "1px dashed var(--gold-soft)" }}
              >
                <Upload className="h-8 w-8 text-[color:var(--gold)]" strokeWidth={1} />
                <span
                  className="font-[Cormorant_Garamond,serif] italic text-lg text-foreground"
                >
                  Arrastra tu imagen aquí
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
                  o haz clic para seleccionar
                </span>
                <input id="chatea-photo-upload" type="file" accept="image/*" className="hidden" />
              </label>
              <p className="mt-6 text-center text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--gold)]">
                Edición fotográfica · Próximamente
              </p>
            </div>
          ) : (
            <>
          {active?.needsLanguage && (
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Idioma destino (Inglés, Francés, Japonés…)"
              className="w-full rounded-sm bg-[oklch(0.05_0_0)] px-4 py-2 text-sm outline-none font-light"
              style={{ border: "1px solid var(--gold-soft)" }}
            />
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={active?.placeholder}
            rows={5}
            className="w-full rounded-sm bg-[oklch(0.05_0_0)] px-4 py-3 text-sm outline-none font-light resize-y"
            style={{ border: "1px solid var(--gold-soft)" }}
          />

          <div className="flex justify-end">
            <button
              onClick={submit}
              disabled={loading || !input.trim()}
              className="px-6 py-2 text-[0.7rem] uppercase tracking-[0.3em] text-[color:var(--gold)] hover:text-foreground transition-all duration-500 font-light disabled:opacity-40"
              style={{ border: "1px solid var(--gold-soft)" }}
            >
              {loading ? "Procesando…" : "Generar"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-destructive-foreground bg-destructive/20 p-3 rounded-sm">{error}</p>
          )}

          {output && (
            <div
              key={output}
              className="animate-fade-in max-h-96 overflow-auto rounded-sm bg-[oklch(0.05_0_0)] px-10 py-8 font-[Cormorant_Garamond,serif] text-[1.05rem] leading-[1.85] tracking-wide text-foreground whitespace-pre-wrap"
              style={{ border: "1px solid var(--gold-soft)" }}
            >
              {output}
            </div>
          )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
