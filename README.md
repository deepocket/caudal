# Caudal

Landing de **Caudal**, el sistema de las distribuidoras de material quirúrgico: cotiza, compra, entrega con lote, timbra y cobra en un solo cauce.

Sitio de marketing en español. Next.js (App Router), TypeScript, Tailwind, shadcn/ui.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Vercel

Proyecto listo para conectar a Vercel (framework Next.js). El formulario de contacto necesita las variables de entorno descritas abajo.

## Contenido

1. **Hero** con la cinta de marca (`components/landing/flow-lines.tsx`) y la franja de etapas, donde un folio cambia de estado en vivo.
2. **Pruébalo** (`components/crm-demo/`): una demo interactiva del CRM con datos de ejemplo. El visitante acepta, cobra, factura y entrega una cotización; las reglas viven en `components/crm-demo/model.ts`.
3. **Producto**: bento de tarjetas con demos animadas de la app; cada una abre su detalle.
4. **Cifras** de la operación de ArtroConfort, la distribuidora donde nació Caudal (`lib/proof.ts`).
5. **Para quién**: tres perfiles con gráficos (`components/landing/audience/`).
6. **Contacto**: formulario para agendar demo (ver abajo).

Las demos (`components/mocks/`) recrean la app real con datos ficticios (`lib/demo-data.ts`): nunca clientes, médicos ni pacientes reales. Cada afirmación debe existir en el producto; lo planeado no se muestra.

## Formulario de contacto

Todos los **Agendar demo** llevan a `#contacto` (`components/landing/contact.tsx`). El formulario lo procesa una Server Action (`lib/leads/actions.ts`) y manda dos correos separados con [Resend](https://resend.com):

1. Un **aviso interno** a `LEAD_NOTIFY_EMAIL` con todos los datos. Si respondes a ese correo, le escribes directamente al cliente.
2. Una **confirmación al cliente**. Nunca incluye el correo interno (no hay cc ni bcc).

Variables de entorno (ver `.env.example`; en local van en `.env.local`, que no se sube al repo):

| Variable | Para qué |
| --- | --- |
| `RESEND_API_KEY` | API key de Resend. |
| `LEAD_FROM_EMAIL` | Remitente, p. ej. `Caudal <hola@trycaudal.com>`. Debe estar en un dominio verificado en Resend. |
| `LEAD_NOTIFY_EMAIL` | A dónde llega el aviso interno. Solo vive en el servidor. |
| `LEAD_REPLY_TO` | Opcional: a dónde llegan las respuestas del cliente a su confirmación. |

- **Dominio:** verifica `trycaudal.com` en Resend → Domains (registros DNS). Sin dominio verificado, Resend solo permite el remitente `onboarding@resend.dev`, que únicamente entrega al correo dueño de la cuenta de Resend: el aviso interno puede llegar, pero la confirmación al cliente no.
- **Vercel:** agrega las mismas variables en Project Settings → Environment Variables (Production y Preview) y vuelve a desplegar.
- **Sin configurar:** en desarrollo, la solicitud se imprime en la consola del servidor y el formulario muestra el éxito, para probar la interfaz. En producción, el formulario muestra un error con el correo de contacto.
- **Anti-spam:** campo trampa oculto y límite de 5 envíos cada 10 minutos por IP (en memoria, por instancia; para más, usa el Firewall de Vercel).

## SEO y agentes de IA

El contenido vive en datos, no en el JSX, para que la página, los datos estructurados y las versiones para agentes digan siempre lo mismo:

| Archivo | Qué contiene |
| --- | --- |
| `lib/site.ts` | Título, descripción y palabras clave para México; correo y **teléfono de ventas**. |
| `lib/product-content.ts` | Qué hace cada módulo (bento, JSON-LD y Markdown). |
| `lib/faq.ts` | Preguntas frecuentes (sección, `FAQPage` y Markdown). |
| `lib/flow-stages.ts`, `lib/audiences.ts`, `lib/proof.ts` | Etapas, perfiles y cifras. |

- **Metadatos:** `app/layout.tsx` (canónica, `es-MX`, Open Graph, X, robots). La imagen para compartir la genera `app/opengraph-image.tsx`, con Inter porque el renderizador mide mal la Geist.
- **Datos estructurados:** `lib/structured-data.ts` arma un grafo schema.org (`Organization`, `WebSite`, `SoftwareApplication`, `WebPage`, `FAQPage`).
- **Rastreo:** `app/robots.ts` invita a buscadores y agentes de IA (GPTBot, ClaudeBot, PerplexityBot…); `app/sitemap.ts` y `app/manifest.ts`.
- **Para agentes:** `/llms.txt` (resumen según [llmstxt.org](https://llmstxt.org)) y `/index.md` (toda la página en Markdown). Pedir `/` con `Accept: text/markdown` devuelve el Markdown (`next.config.ts`).
- **Demos:** llevan `data-nosnippet` para que Google no muestre los datos de ejemplo como si fueran clientes.
- **Llamadas:** llena `site.phone` (formato E.164 y cómo se lee) y aparecen el teléfono en el encabezado, la tarjeta "¿Prefieres llamar?", el botón "Llamar" en la barra móvil y el `telephone` en los datos estructurados. Los enlaces llevan `data-cta="llamar"` para medirlos con tu etiqueta de analítica.
- **Search Console:** pon el token en `GOOGLE_SITE_VERIFICATION`, verifica el dominio y envía `https://trycaudal.com/sitemap.xml`.
