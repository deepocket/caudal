import { Audience } from "@/components/landing/audience";
import { Contact } from "@/components/landing/contact";
import { Faq } from "@/components/landing/faq";
import { FlowLines } from "@/components/landing/flow-lines";
import { FlowRail } from "@/components/landing/flow-rail";
import { Hero } from "@/components/landing/hero";
import { MobileCta } from "@/components/landing/mobile-cta";
import { Product } from "@/components/landing/product";
import { Proof } from "@/components/landing/proof";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { TryIt } from "@/components/landing/try-it";
import { structuredDataJson } from "@/lib/structured-data";

export default function Home() {
  return (
    <div id="top" className="relative flex min-h-full flex-col overflow-x-clip">
      {/* Who we are and what the software does, for search engines and AI assistants. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson() }} />
      {/* The ribbon runs behind the header too, as stripe.com's wave does. */}
      <FlowLines className="absolute top-0 right-0 h-[560px] w-full opacity-45 [mask-image:linear-gradient(to_bottom,black_65%,transparent)] md:h-[900px] md:opacity-100" />
      <SiteHeader />
      <main className="relative flex-1">
        <Hero />
        <FlowRail />
        <TryIt />
        <Product />
        <Proof />
        <Audience />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <MobileCta />
    </div>
  );
}
