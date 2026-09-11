import { faq } from "@/lib/faq";
import { pricing } from "@/lib/pricing";
import { productModules } from "@/lib/product-content";
import { hasPhone, site } from "@/lib/site";

// schema.org graph for search engines and AI assistants: who Caudal is, what
// the software does, where it serves, and the FAQ, all tied together by @id.

const id = (fragment: string) => `${site.url}/#${fragment}`;

const mexico = { "@type": "Country", name: "México", identifier: "MX" };

export function structuredData() {
  const contactPoint = {
    "@type": "ContactPoint",
    contactType: "sales",
    email: site.email,
    ...(hasPhone ? { telephone: site.phone.e164 } : {}),
    areaServed: "MX",
    availableLanguage: ["es"],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": id("organization"),
        name: site.name,
        url: site.url,
        logo: `${site.url}/caudal-wordmark.svg`,
        email: site.email,
        ...(hasPhone ? { telephone: site.phone.e164 } : {}),
        description: site.description,
        areaServed: mexico,
        contactPoint: [contactPoint],
        knowsAbout: site.seo.keywords.filter((keyword) => keyword !== "México"),
      },
      {
        "@type": "WebSite",
        "@id": id("website"),
        url: site.url,
        name: site.name,
        description: site.seo.description,
        inLanguage: site.locale,
        publisher: { "@id": id("organization") },
      },
      {
        "@type": "SoftwareApplication",
        "@id": id("software"),
        name: site.name,
        url: site.url,
        description: site.seo.description,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "CRM y ERP para distribuidoras de material quirúrgico",
        operatingSystem: "Web",
        inLanguage: site.locale,
        areaServed: mexico,
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Distribuidoras de material quirúrgico e insumos médicos",
          geographicArea: mexico,
        },
        featureList: productModules.map((module) => `${module.title}: ${module.description}`),
        // Monthly plans; the enterprise quote has no public price.
        offers: pricing.plans.map((amount) => ({
          "@type": "Offer",
          price: String(amount),
          priceCurrency: pricing.currency,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(amount),
            priceCurrency: pricing.currency,
            unitCode: "MON",
            billingDuration: "P1M",
          },
          url: `${site.url}/#contacto`,
          availability: "https://schema.org/InStock",
        })),
        publisher: { "@id": id("organization") },
      },
      {
        "@type": "WebPage",
        "@id": id("webpage"),
        url: site.url,
        name: site.seo.title,
        description: site.seo.description,
        inLanguage: site.locale,
        isPartOf: { "@id": id("website") },
        about: { "@id": id("software") },
        primaryImageOfPage: `${site.url}/opengraph-image`,
      },
      {
        "@type": "FAQPage",
        "@id": id("preguntas"),
        inLanguage: site.locale,
        isPartOf: { "@id": id("webpage") },
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/** Serialized for a <script type="application/ld+json">, with `<` escaped as the Next docs advise. */
export function structuredDataJson() {
  return JSON.stringify(structuredData()).replace(/</g, "\\u003c");
}
