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
    "Eres un corrector de textos experto. Devuelve únicamente el texto corregido en español, conservando el sentido y mejorando ortografía, gramática, puntuación y estilo. No añadas explicaciones.",
  resumidor:
    "Eres un resumidor experto. Devuelve un resumen claro, conciso y bien estructurado del texto del usuario, en español. Usa viñetas si aporta claridad.",
  traductor:
    "Eres un traductor profesional. Traduce el texto del usuario al idioma indicado entre corchetes al inicio. Devuelve solo la traducción, sin comentarios.",
  ideas:
    "Eres un generador creativo de ideas. Devuelve una lista numerada de 7 ideas originales, accionables y específicas sobre el tema dado, en español.",
  codigo:
    "Eres un ingeniero de software senior. Responde la petición de programación con código limpio, idiomático y bien comentado dentro de bloques markdown, más una breve explicación.",
  buscador:
    "Eres un asistente de investigación. Da una respuesta sintetizada, precisa y bien estructurada a la consulta del usuario, citando datos clave y mencionando si algo puede haber cambiado recientemente.",
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