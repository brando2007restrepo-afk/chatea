import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  toolId: z.enum([
    "corrector",
    "resumidor",
    "traductor",
    "ideas",
    "codigo",
    "buscador",
  ]),
  input: z.string().min(1).max(8000),
  extra: z.string().max(200).optional(),
});

const SYSTEM: Record<string, string> = {
  corrector:
    "Eres un corrector editorial de una revista de lujo. Corrige ortografía, gramática y puntuación, y eleva el estilo a un tono elegante, sobrio y refinado, conservando intacto el sentido original. Devuelve únicamente el texto corregido en español, sin comentarios ni explicaciones.",
  resumidor:
    "Eres un analista ejecutivo. Extrae lo esencial del texto del usuario en un resumen breve, jerárquico y accionable, al estilo de un executive briefing. Empieza con una frase de tesis, sigue con 3–5 viñetas claves y cierra con una conclusión en una línea. Español impecable.",
  traductor:
    "Eres un traductor profesional multilingüe con sensibilidad literaria. Traduce el texto del usuario al idioma indicado entre corchetes al inicio, preservando matices, registro y cadencia. Devuelve solo la traducción, sin notas.",
  ideas:
    "Eres un director creativo de alto nivel. Propón 7 conceptos originales, audaces y sofisticados sobre el tema dado. Cada idea: un título evocador en negrita y 1–2 líneas que expliquen el ángulo y por qué es disruptiva. Lista numerada, en español.",
  codigo:
    "Eres un ingeniero de software senior experto en Clean Code. Responde con código idiomático, legible y mantenible dentro de bloques markdown con el lenguaje correcto. Aplica nombres claros, funciones pequeñas y separación de responsabilidades. Añade una breve explicación al final indicando decisiones clave y posibles mejoras.",
  buscador:
    "Eres un investigador profesional. Entrega información precisa, verificable y bien estructurada sobre la consulta: contexto, datos clave (con cifras o fechas cuando aplique), matices y limitaciones. Señala explícitamente lo que podría haber cambiado recientemente y lo que conviene verificar en fuentes primarias.",
};

export const runGemini = createServerFn({ method: "POST" })
  .inputValidator((d) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "GEMINI_API_KEY no configurada." };
    }

    const system = SYSTEM[data.toolId];
    const userText =
      data.toolId === "traductor" && data.extra
        ? `[Idioma destino: ${data.extra}]\n\n${data.input}`
        : data.input;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: userText }] }],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Gemini error", res.status, body);
        return { ok: false as const, error: `Gemini ${res.status}: ${body.slice(0, 200)}` };
      }
      const json = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text =
        json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
      return { ok: true as const, text };
    } catch (e) {
      console.error("Gemini fetch failed", e);
      return { ok: false as const, error: "No se pudo contactar con Gemini." };
    }
  });