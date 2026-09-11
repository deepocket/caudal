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

Proyecto listo para conectar a Vercel (framework Next.js). El formulario de contacto y el panel de solicitudes necesitan las variables de entorno descritas abajo.

Las visitas se cuentan con Vercel Web Analytics (`<Analytics />` en `app/layout.tsx`, sin cookies y solo en los despliegues de Vercel). Se ven en el proyecto de Vercel → Analytics.

## Contenido

1. **Hero** con la cinta de marca (`components/landing/flow-lines.tsx`) y la franja de etapas, donde un folio cambia de estado en vivo.
2. **Pruébalo** (`components/crm-demo/`): una demo interactiva del CRM con datos de ejemplo. El visitante acepta, cobra, factura y entrega una cotización; las reglas viven en `components/crm-demo/model.ts`.
3. **Producto**: bento de tarjetas con demos animadas de la app; cada una abre su detalle.
4. **Cifras** de la operación de ArtroConfort, la distribuidora donde nació Caudal (`lib/proof.ts`).
5. **Para quién**: tres perfiles con gráficos (`components/landing/audience/`).
6. **Contacto**: formulario para agendar demo (ver abajo).

Las demos (`components/mocks/`) recrean la app real con datos ficticios (`lib/demo-data.ts`): nunca clientes, médicos ni pacientes reales. Cada afirmación debe existir en el producto; lo planeado no se muestra.

## Formulario de contacto

Todos los **Agendar demo** llevan a `#contacto` (`components/landing/contact.tsx`). El formulario lo procesa una Server Action (`lib/leads/actions.ts`), que guarda la solicitud para el [panel](#panel-de-solicitudes) y manda dos correos separados con [Resend](https://resend.com):

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
- **Si falla el correo:** la solicitud se guarda antes de enviar. Si el aviso interno falla pero la solicitud quedó guardada, el cliente ve el éxito igual y la encuentras en el panel.

## Panel de solicitudes

En `/admin` ves cada solicitud del formulario: los datos del contacto, botones para llamar, escribir por WhatsApp o por correo, su estado (Nuevo → Contactado → Demo agendada → Cliente, o Perdido) y tus notas. No aparece en buscadores.

- **Entrar:** una sola contraseña, `ADMIN_PASSWORD`. La sesión dura 30 días en una cookie firmada con `ADMIN_SESSION_SECRET` (genera una con `openssl rand -base64 32`). Cambiar cualquiera de las dos cierra todas las sesiones. Máximo 5 intentos cada 10 minutos por IP.
- **Dónde se guardan** (`lib/leads/store/`): el panel y el formulario usan la misma interfaz, así que cambiar de almacenamiento no toca nada más.

| Dónde corre | Sin `LEADS_DATABASE_URL` | Con `LEADS_DATABASE_URL` |
| --- | --- | --- |
| Tu equipo (`npm run dev`) | `.data/leads.json`, fuera del repo | Supabase, `sitio.leads` |
| Vercel | No se guardan; solo llegan por correo | Supabase, `sitio.leads` |

`.data/` está en `.gitignore`: tiene nombres, teléfonos y correos, y este repo es público.

### Supabase

Las solicitudes viven en el proyecto de Supabase del CRM (`artroconfort-logistics`), en su propio esquema `sitio`. La página no usa las llaves de Supabase, que abren toda la base: entra por el pooler con el usuario `caudal_sitio`, que solo puede leer, crear y actualizar `sitio.leads`. No puede borrar ni ver clientes, facturas o secretos. Si sus credenciales se filtran, el resto de la base queda fuera de su alcance.

Para montarlo de cero (en otro proyecto, por ejemplo):

1. En **SQL Editor**, corre `supabase/migrations/20260911190000_sitio_leads.sql`. Crea el esquema, la tabla (las mismas columnas que el tipo `Lead` de `lib/leads/types.ts`) y el usuario `caudal_sitio`, todavía sin contraseña.
2. Ponle contraseña, larga y solo con letras y números: `alter role caudal_sitio with password '…';`
3. En **Connect → Transaction pooler** copia la cadena de conexión (puerto 6543), cambia el usuario por `caudal_sitio.<project-ref>` y pon esa contraseña. Guárdala como `LEADS_DATABASE_URL` en Vercel, como secreto y nunca con prefijo `NEXT_PUBLIC_`.
4. Vuelve a desplegar.

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
- **Search Console:** pon el token en `GOOGLE_SITE_VERIFICATION`, verifica el dominio y envía `https://www.trycaudal.com/sitemap.xml`. El dominio principal en Vercel es `www` (el apex redirige ahí); si algún día cambias eso, cambia también `site.url`.
