import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini client lazy loader to prevent app crashes if key is missing on startup
  let aiInstance: GoogleGenAI | null = null;
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    if (!aiInstance) {
      aiInstance = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiInstance;
  }

  // --- API ENDPOINTS ---

  // 1. IA de Análisis de Progreso Fisicoquímico
  app.post("/api/gemini/progreso", async (req, res) => {
    try {
      const { name, history } = req.body;
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analiza el historial de datos corporales del socio y genera un diagnóstico sintetizado y motivador de máximo 2 oraciones en español.
Socio: ${name || "Molly"}
Historial de datos corporales de las últimas semanas:
${JSON.stringify(history || [])}

Instrucciones:
- Si el socio bajó grasa y mantuvo peso (o aumentó músculo), felicítalo por la ganancia muscular y recomiéndale continuar así.
- Si no hay suficientes registros o la tendencia no es clara, genera un resumen entusiasta animándolo a seguir registrando con más frecuencia.
- Sé extremadamente profesional y motivador en el tono, emulando la excelencia de Dragon GYM.`,
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error en progreso:", error);
      res.status(500).json({ error: error.message || "Error al procesar el progreso con la IA" });
    }
  });

  // 2. IA de Sobrecarga Progresiva (Rutinas Inteligentes)
  app.post("/api/gemini/sobrecarga", async (req, res) => {
    try {
      const { name, routine } = req.body;
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analiza el rendimiento del socio en sus entrenamientos y sugiere ajustes de sobrecarga progresiva o alerta si hay un estancamiento.
Socio: ${name || "Molly"}
Rutina actual:
${JSON.stringify(routine || {})}

Instrucciones:
- Genera sugerencias de incrementos del 5% al 10% (por ejemplo, subir peso o aumentar reps) para mantener la estimulación muscular de manera segura.
- Si ves estancamiento (por ejemplo, entrenar prensa con la misma carga por más de 3 semanas), sugiérele un incremento directo (ej. "Llevas 3 semanas con el mismo peso en Prensa. Es momento de incrementar un 5% (de 50kg a 52.5kg) para mantener la estimulación").
- Da un consejo breve, directo, accionable y motivador de máximo 2-3 oraciones en español.`,
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error en sobrecarga:", error);
      res.status(500).json({ error: error.message || "Error en el análisis de sobrecarga progresiva" });
    }
  });

  // 3. IA de Generación de Push Notifications Personalizadas
  app.post("/api/gemini/notificacion", async (req, res) => {
    try {
      const { name, attendancePattern } = req.body;
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Genera una notificación push altamente personalizada, persuasiva y motivacional para el socio de Dragon GYM basada en su patrón de asistencia.
Socio: ${name || "Molly"}
Patrón de asistencia reciente: ${attendancePattern || "asistió Lunes, Miércoles, Viernes"}

Instrucciones:
- Si tiene asistencia constante, felicítalo efusivamente y aliéntalo a seguir con su racha de disciplina.
- Si lleva días sin asistir o racha inactiva, genera un mensaje persuasivo, empático y acogedor, recordándole que un entrenamiento corto hoy es mejor que nada y que su cuerpo lo extraña en Dragon GYM.
- Genera un mensaje corto e impactante (máximo 2 oraciones) en español.`,
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error en notificacion:", error);
      res.status(500).json({ error: error.message || "Error al generar la notificación push" });
    }
  });

  // 4. Sustituto Inteligente de Ejercicios
  app.post("/api/gemini/sustituto", async (req, res) => {
    try {
      const { name, exercise, machines } = req.body;
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Eres el Asistente de Sala Inteligente de Dragon GYM. Sugiérele al socio una o dos alternativas óptimas de ejercicios que trabajen el mismo grupo muscular, utilizando el catálogo de máquinas del club.
Socio: ${name || "Molly"}
Ejercicio o máquina que está ocupada: "${exercise}"
Catálogo de máquinas disponibles en Dragon GYM:
${JSON.stringify(machines || [])}

Instrucciones:
- Sugiere ejercicios alternativos que estén en la lista de máquinas disponibles o que se puedan hacer alternativamente si la máquina seleccionada está ocupada.
- Explica brevemente por qué es un excelente sustituto enfocado en el grupo muscular trabajado (ej. cuádriceps, dorsal, pecho, etc.).
- Respuesta en español, directa, amigable, de máximo 2 oraciones.`,
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error en sustituto:", error);
      res.status(500).json({ error: error.message || "Error al generar sustituto de ejercicio" });
    }
  });

  // 5. IA Generadora de Rutinas Basada en Equipamiento Real
  app.post("/api/gemini/generar-rutina", async (req, res) => {
    try {
      const { profile, machines } = req.body;
      const ai = getGeminiClient();
      
      const prompt = `Eres el Coordinador Técnico de Dragon GYM. Genera una rutina de entrenamiento complementaria personalizada en formato JSON basada en el perfil del socio y el inventario de máquinas disponibles.

Perfil del socio:
- Objetivo: ${profile?.objetivo || "Hipertrofia muscular general"}
- Lesiones o restricciones: ${profile?.lesiones || "Ninguna"}
- Días por semana disponibles: ${profile?.dias || 3}

Catálogo de máquinas/equipamiento del gimnasio:
${JSON.stringify(machines || [])}

Instrucciones:
- Crea una rutina complementaria coherente que NO sobrecargue las zonas lesionadas del socio.
- Utiliza ÚNICAMENTE ejercicios factibles con las máquinas provistas en el catálogo anterior o ejercicios libres estándar (como sentadillas, flexiones, peso muerto, etc.).
- Devuelve EXACTAMENTE un objeto JSON válido con la siguiente estructura (no agregues texto fuera del JSON):
{
  "title": "Nombre de la rutina (ej. Fuerza Dragon Posterior)",
  "daysPerWeek": 3,
  "exercises": [
    {
      "name": "Nombre exacto del ejercicio",
      "sets": 4,
      "reps": "12, 10, 8, 8",
      "notes": "Consejo técnico enfocado en la prevención de lesiones o ejecución perfecta"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      let data;
      try {
        data = JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Error al parsear JSON devuelto por Gemini:", response.text);
        throw new Error("Gemini no devolvió un JSON estructurado de rutina válido.");
      }

      res.json(data);
    } catch (error: any) {
      console.error("Error en generar-rutina:", error);
      res.status(500).json({ error: error.message || "Error al generar la rutina con Gemini" });
    }
  });

  // 6. Detector de Riesgo de Lesión por Estancamiento/Fatiga
  app.post("/api/gemini/detectar-riesgo", async (req, res) => {
    try {
      const { socioName, volumeReport } = req.body;
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Eres el Sistema de Seguridad y Prevención de Lesiones de Dragon GYM.
Analiza el reporte de volumen total de entrenamiento levantado por grupo muscular (en kg, calculado como Series * Reps * Peso) de esta semana contra la semana pasada.
Genera una alerta de riesgo de lesión detallada, preventiva, empática y muy profesional para el entrenador en español.

Socio: ${socioName || "Molly"}
Reporte de Volumen de Carga por Grupo Muscular:
${JSON.stringify(volumeReport || [])}

Instrucciones:
- Si detectas un incremento brusco mayor al 30% en algún grupo muscular (ej. Hombros que subió de 800kg a 1150kg), levanta una alerta crítica advirtiendo sobre el riesgo de tendinitis o fatiga excesiva (ej. "¡Alerta Crítica! ${socioName} ha incrementado su volumen de hombro un 43% esta semana. Se recomienda revisar su técnica para evitar pinzamiento o sobrecarga.").
- Si no hay incrementos peligrosos, felicita el progreso equilibrado del socio y da un consejo de autorregulación.
- Respuesta directa de máximo 2 oraciones en español.`,
      });

      res.json({ alert: response.text });
    } catch (error: any) {
      console.error("Error en detectar-riesgo:", error);
      res.status(500).json({ error: error.message || "Error al analizar el riesgo de lesión" });
    }
  });

  // 7. IA Recomendadora de Suplementos (Cross-selling)
  app.post("/api/gemini/sugerir-suplementos", async (req, res) => {
    try {
      const { clientName, objective, previousPurchases } = req.body;
      const ai = getGeminiClient();

      const prompt = `Eres el Asistente Experto de Suplementación y Nutrición Deportiva de Dragon GYM.
Analiza las compras anteriores y el objetivo del atleta para formular una recomendación personalizada de venta cruzada (cross-selling).

Atleta: ${clientName || "Socio"}
Objetivo: ${objective || "Hipertrofia/Fuerza"}
Compras previas: ${JSON.stringify(previousPurchases || [])}

Instrucciones:
- Recomienda un producto específico de nuestra tienda (Proteína de Suero, Creatina Monohidratada, Bebida de Electrólitos, Barra Energética o Pre-Entreno Dragon Punch) que potencie su objetivo.
- Si compró una proteína hace 3-4 semanas, adviértele que está por terminarse ("A ${clientName || "Juan"} le queda aproximadamente 1 semana de proteína") y sugiérele reabastecerse o complementarlo.
- Redacta una recomendación de venta cruzada atractiva, profesional, empática y persuasiva en español.
- Máximo 2 oraciones.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ recommendation: response.text });
    } catch (error: any) {
      console.error("Error en sugerir-suplementos:", error);
      res.status(500).json({ error: error.message || "Error al generar recomendación de suplementos" });
    }
  });

  // 8. Asistente de Preguntas Frecuentes (FAQ / Chat de Consultas)
  app.post("/api/gemini/redactar-respuesta", async (req, res) => {
    try {
      const { clientName, queryText, membershipLevel } = req.body;
      const ai = getGeminiClient();

      const prompt = `Eres el Coordinador de Atención al Cliente de Dragon GYM Polanco.
Redacta un borrador de respuesta impecable, cordial y directo en español para el atleta basándote en su consulta y su nivel de membresía.

Atleta: ${clientName || "Socio"}
Nivel de membresía: ${membershipLevel || "Plan Mensual Estándar"}
Consulta: "${queryText || "¿Cuáles son los horarios?"}"

Reglas Oficiales de Dragon GYM:
1. Toallas y Amenidades Premium (sauna, vapor, vestidores VIP): Incluidas exclusivamente en 'VIP Dragon Pass'. Para 'Plan Mensual Estándar' o 'Plan Anual Elite', la renta de toalla cuesta $2 USD o pueden subir a plan VIP.
2. Congelación de cuenta: El 'Plan Mensual Estándar' NO se puede congelar. El 'Plan Anual Elite' permite congelar hasta 15 días al año por viaje. El 'VIP Dragon Pass' permite congelar hasta 30 días al año sin costo.
3. Horario oficial de operaciones: Lunes a Viernes de 06:00 AM a 10:00 PM. Sábados de 07:00 AM a 06:00 PM. Domingos de 08:00 AM a 02:00 PM.
4. Estacionamiento subterráneo: 2 horas de cortesía gratis para todos los socios activos validando su QR de entrada en la recepción.

Instrucciones:
- Responde de forma precisa y educada adaptando el contenido a sus reglas.
- Redacta el borrador listo para enviar (en primera persona como el Staff de Dragon GYM).
- Respuesta máxima de 2 o 3 oraciones en español.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ draft: response.text });
    } catch (error: any) {
      console.error("Error en redactar-respuesta:", error);
      res.status(500).json({ error: error.message || "Error al redactar borrador de respuesta rápida" });
    }
  });

  // 9. Agente de Reporte Matutino (Daily Executive Briefing)
  app.post("/api/gemini/reporte-matutino", async (req, res) => {
    try {
      const { asistenciasCount, pagosCount, ingresosTotal, vencimientosHoy, clientesRiesgo } = req.body;
      const ai = getGeminiClient();

      const prompt = `Eres el Director de Estrategia Operativa e Inteligencia de Dragon GYM.
Sintetiza la operación del día de ayer de manera ejecutiva e inteligente para el dueño/administrador del gimnasio.
Redacta un reporte matutino (Daily Executive Briefing) que se enviaría a las 7:00 AM.

Métricas de entrada:
- Total de asistentes registrados (Check-ins de ayer): ${asistenciasCount || 0}
- Pagos procesados de ayer: ${pagosCount || 0} transacciones
- Ingresos brutos consolidados: $${ingresosTotal || 0} USD
- Membresías próximas a vencer hoy: ${vencimientosHoy || 0} membresías
- Lista de socios en riesgo de deserción (Churn alto): ${JSON.stringify(clientesRiesgo || [])}

Instrucciones:
- Presenta un informe estructurado, con viñetas elegantes, en un español formal y directo.
- Secciones obligatorias:
  1. 📈 RESUMEN OPERATIVO DE AYER (Total asistentes, transacciones, ingresos).
  2. ⚠️ ALERTAS FINANCIERAS & EXPIRACIONES (Suscripciones a vencer hoy).
  3. 🚨 ANÁLISIS DE RETENCIÓN DE CLIENTES (Socio, ausencias, riesgo y recomendación de campaña de rescate).
  4. 💡 PROPUESTA ESTRATÉGICA (Un consejo operativo concreto basado en los datos).
- Máximo 300 palabras. Mantén el tono sofisticado y de alta dirección de Dragon GYM.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error en reporte-matutino:", error);
      res.status(500).json({ error: error.message || "Error al generar reporte matutino" });
    }
  });

  // 10. Motor de Predicción de Abandono (Churn Risk Analyzer)
  app.post("/api/gemini/predecir-churn", async (req, res) => {
    try {
      const { clientName, visits30Days, daysToExpiry, purchases, objective } = req.body;
      const ai = getGeminiClient();

      const prompt = `Eres el Coordinador de Retención y Fidelización Inteligente de Dragon GYM.
Analiza minuciosamente los siguientes parámetros de comportamiento del socio para diagnosticar su riesgo de abandono (Churn).

Parámetros del Socio:
- Nombre: ${clientName || "Socio"}
- Visitas registradas en los últimos 30 días: ${visits30Days || "Ninguna"}
- Días que le quedan antes de vencer su membresía: ${daysToExpiry || 0} días
- Historial de compras en tienda: ${purchases || "Ninguno"}
- Objetivo del atleta: ${objective || "Hipertrofia"}

Instrucciones:
- Clasifica el riesgo de deserción en uno de tres niveles: "Bajo", "Medio" o "Alto".
- Calcula un porcentaje preciso de riesgo (ej. "84%").
- Redacta una justificación analítica breve de por qué se le asigna ese riesgo.
- Diseña un mensaje de WhatsApp / Notificación Push persuasivo y personalizado para rescatar al socio (mencionando su objetivo o compras anteriores de manera elegante).
- Devuelve EXACTAMENTE un objeto JSON válido con la siguiente estructura (no agregues texto fuera del JSON):
{
  "risk": "Bajo" | "Medio" | "Alto",
  "probability": "XX%",
  "reason": "Explicación del comportamiento e inactividad en español",
  "rescueMessage": "Mensaje personalizado de rescate redactado en primera persona para enviarlo por WhatsApp"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      let data;
      try {
        data = JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Error al parsear JSON devuelto por Churn Risk:", response.text);
        throw new Error("Gemini no devolvió un JSON estructurado de Churn válido.");
      }

      res.json(data);
    } catch (error: any) {
      console.error("Error en predecir-churn:", error);
      res.status(500).json({ error: error.message || "Error al analizar el riesgo de abandono" });
    }
  });

  // 11. Integración de Visión por Computadora (Cámaras IA)
  app.post("/api/gemini/analizar-camaras", async (req, res) => {
    try {
      const { cameraName, recentCheckIns } = req.body;
      const ai = getGeminiClient();

      const prompt = `Eres el Servidor Central de Visión por Computadora YOLOv8 de Dragon GYM.
Simula el procesamiento en tiempo real del flujo RTSP de la cámara de seguridad seleccionada.

Área Monitoreada: ${cameraName || "Musculación"}
Check-ins registrados en la App en las últimas 2 horas: ${JSON.stringify(recentCheckIns || [])}

Instrucciones:
- Simula que analizas el fotograma actual detectando el número de personas presentes físicamente.
- Compara la cantidad de personas detectadas visualmente por la cámara con los check-ins de la App.
- Si hay discrepancias (por ejemplo, personas detectadas visualmente pero no registradas en los check-ins recientes), levanta una alerta por aforo sin torniquete.
- Genera un nivel de saturación de la zona de 0% a 100%.
- Devuelve EXACTAMENTE un objeto JSON válido con la siguiente estructura (no agregues texto fuera del JSON):
{
  "cameraCount": 12,
  "appCount": 9,
  "discrepancy": true,
  "alerts": ["Alerta: Se detectan 3 personas no registradas físicamente en el área de musculación."],
  "saturation": 80
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      let data;
      try {
        data = JSON.parse(response.text || "{}");
      } catch (e) {
        console.error("Error al parsear JSON devuelto por Cámara:", response.text);
        throw new Error("Gemini no devolvió un JSON estructurado de cámara válido.");
      }

      res.json(data);
    } catch (error: any) {
      console.error("Error en analizar-camaras:", error);
      res.status(500).json({ error: error.message || "Error al simular procesamiento de visión por computadora" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
