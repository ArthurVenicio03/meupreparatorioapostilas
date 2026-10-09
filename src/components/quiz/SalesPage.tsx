import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Logo } from "./Primitives";
import amostra1 from "@/assets/apostila/pagina-1.png.asset.json";
import amostra2 from "@/assets/apostila/pagina-2.png.asset.json";
import amostra3 from "@/assets/apostila/pagina-3.png.asset.json";
import amostra4 from "@/assets/apostila/pagina-4.png.asset.json";
import amostra5 from "@/assets/apostila/pagina-5.png.asset.json";
import amostra6 from "@/assets/apostila/pagina-6.png.asset.json";
import amostra7 from "@/assets/apostila/pagina-7.png.asset.json";
import heroMockup from "@/assets/mockup-principal.png.asset.json";
import {
  CHECKOUT_URL,
  STATUS_LABEL,
  type Subject,
} from "@/lib/quiz-data";
import { track } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const subjects: { key: Subject; label: string }[] = [
  { key: "portugues", label: "Português" },
  { key: "matematica", label: "Matemática" },
  { key: "informatica", label: "Informática" },
];

const content: Record<Subject, { description: string; topics: string[] }> = {
  portugues: {
    description: "Conteúdos fundamentais para estudar e revisar Língua Portuguesa.",
    topics: [
      "Compreensão e interpretação de textos",
      "Funções da linguagem",
      "Gêneros textuais",
      "Coesão e coerência",
      "Classes das palavras",
      "Formação de palavras",
      "Termos da oração",
      "Concordância verbal e nominal",
      "Homônimos e parônimos",
      "Sinônimos e antônimos",
      "Crase",
      "Questões de interpretação e gramática",
    ],
  },
  matematica: {
    description: "Uma base organizada para revisar os principais conteúdos de Matemática.",
    topics: [
      "Conjuntos e operações",
      "Razão e proporção",
      "Divisão proporcional",
      "Regra de três simples e composta",
      "Porcentagem, aumentos e descontos",
      "Probabilidade",
      "Função de 1º e 2º grau",
      "Geometria plana",
      "Área, perímetro e figuras planas",
      "Circunferência, círculo e triângulos",
      "Raciocínio lógico proposicional",
      "Questões de concursos",
    ],
  },
  informatica: {
    description: "Conteúdos essenciais para estudar e revisar Informática.",
    topics: [
      "Internet, intranet e extranet",
      "Redes e topologias",
      "LAN, MAN, WAN e PAN",
      "Navegadores e ferramentas de busca",
      "URL, HTTP e HTTPS",
      "E-mail, POP3, IMAP e SMTP",
      "FTP, VPN e VoIP",
      "Hardware e dispositivos de rede",
      "Firewall e segurança da informação",
      "Malware, spyware, trojan e ransomware",
      "Criptografia, backup e spam",
      "Confidencialidade, integridade e disponibilidade",
    ],
  },
};

const images = [
  { src: amostra1.url, label: "Página real do material — Português" },
  { src: amostra2.url, label: "Página real do material — Matemática" },
  { src: amostra3.url, label: "Página real do material — Informática" },
  { src: amostra4.url, label: "Página real do material" },
  { src: amostra5.url, label: "Página real do material" },
  { src: amostra6.url, label: "Página real do material" },
  { src: amostra7.url, label: "Página real do material" },
];

const valueItems = [
  "Língua Portuguesa",
  "Matemática",
  "Informática",
  "Conteúdo organizado para estudo",
  "Material para revisão",
];

function CheckoutButton({ children = "QUERO A APOSTILA COMPLETA", className }: { children?: React.ReactNode; className?: string }) {
  const checkout = () => {
    track("checkout_clicked");
    window.location.href = CHECKOUT_URL;
  };

  return (
    <Button
      onClick={checkout}
      className={cn(
        "h-auto rounded-full bg-cta px-7 py-5 font-display text-base font-extrabold tracking-wide text-cta-foreground shadow-cta hover:brightness-110",
        className,
      )}
    >
      {children}
    </Button>
  );
}

function MaterialCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const move = (direction: number) => {
    setActive((current) => (current + direction + images.length) % images.length);
    track("carousel_interacted");
  };

  return (
    <div
      className="mt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        setPaused(true);
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX;

        if (startX !== null && endX !== undefined) {
          const distance = endX - startX;
          if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1);
        }

        touchStartX.current = null;
        setPaused(false);
      }}
    >
      <div className="relative mx-auto flex max-w-4xl touch-pan-y items-center justify-center gap-3 overflow-hidden px-8 sm:px-16">
        <button
          type="button"
          aria-label="Página anterior"
          onClick={() => move(-1)}
          className="absolute left-0 z-10 grid h-10 w-10 place-items-center rounded-full bg-card text-primary shadow-soft ring-1 ring-border sm:left-1"
        >
          ‹
        </button>

        <div className="flex w-full justify-center">
          {images.map((image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.label}
              loading={index === 0 ? "eager" : "lazy"}
              draggable={false}
              className={cn(
                "max-h-[62vh] w-full max-w-sm rounded-2xl object-contain shadow-soft transition-all duration-700 sm:max-h-[540px]",
                index === active ? "scale-100 opacity-100" : "hidden scale-95 opacity-0",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Próxima página"
          onClick={() => move(1)}
          className="absolute right-0 z-10 grid h-10 w-10 place-items-center rounded-full bg-card text-primary shadow-soft ring-1 ring-border sm:right-1"
        >
          ›
        </button>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-muted-foreground">Material real da apostila</p>
      <div className="mt-3 flex justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Ver imagem ${index + 1}`}
            onClick={() => {
              setActive(index);
              track("carousel_interacted");
            }}
            className={cn("h-2.5 rounded-full transition-all", index === active ? "w-8 bg-cta" : "w-2.5 bg-muted")}
          />
        ))}
      </div>
    </div>
  );
}

function OfferCard({ final = false }: { final?: boolean }) {
  return (
    <div className={cn("rounded-3xl p-6 text-center shadow-soft ring-1 ring-border sm:p-9", final ? "bg-primary text-primary-foreground" : "bg-card")}>
      <p className={cn("text-sm font-extrabold tracking-widest", final ? "text-primary-foreground/80" : "text-primary")}>
        PACOTE COMPLETO
      </p>
      <p className={cn("mt-4 text-sm line-through", final ? "text-primary-foreground/70" : "text-muted-foreground")}>
        De R$149,50
      </p>
      <p className={cn("mt-1 font-display text-5xl font-extrabold", final ? "text-cta" : "text-cta")}>R$37,90</p>
      <p className={cn("mt-3 text-sm font-semibold", final ? "text-primary-foreground/80" : "text-muted-foreground")}>
        Economia de R$111,60 · 74% de economia
      </p>
      <CheckoutButton className="mt-6 w-full" />
      <p className={cn("mt-4 text-xs font-semibold", final ? "text-primary-foreground/80" : "text-muted-foreground")}>
        Acesso imediato · Material digital
      </p>
    </div>
  );
}

export function SalesPage() {
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    track("page_view");
    track("product_viewed");
    track("offer_viewed");

    const onScroll = () => setShowStickyCta(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <main className="min-h-screen overflow-x-hidden bg-background pb-20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <Logo size="sm" />
          <span className="hidden text-sm font-bold text-muted-foreground sm:block">Material digital para concursos</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-7 px-4 py-8 sm:gap-10 sm:px-5 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <span
            className="inline-flex rounded-full px-4 py-2 text-sm font-extrabold tracking-widest text-primary-foreground sm:px-5 sm:py-2.5 sm:text-base"
            style={{ backgroundColor: "#0a1a6e" }}
          >
            APOSTILA DIGITAL PARA CONCURSOS PÚBLICOS
          </span>
          <h1 className="mt-5 max-w-xl font-display text-[clamp(2rem,8.5vw,3.75rem)] font-extrabold leading-[1.08] text-brand-dark sm:mt-6">
            Comece sua preparação <span className="text-cta">para concursos</span> pelas matérias que mais caem.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
            Português, Matemática e Informática em um único PDF, com 63 páginas diretas ao ponto e questões de bancas para você praticar.
          </p>

          <Button
            type="button"
            onClick={() => {
              track("cta_clicked");
              document.getElementById("veja-o-valor-do-pacote")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-6 h-14 w-full rounded-full bg-cta px-5 py-4 font-display text-sm font-extrabold tracking-wide text-cta-foreground shadow-cta hover:brightness-110 sm:mt-7 sm:h-auto sm:w-auto sm:px-7 sm:py-5 sm:text-base"
          >
            QUERO COMEÇAR MEUS ESTUDOS
          </Button>
        </div>

        <div className="flex justify-center px-2 py-2 sm:px-0 sm:py-4">
          <img
            src={heroMockup.url}
            alt="Apostila Básicas para Concursos com páginas de amostra"
            width={432}
            height={578}
            className="h-auto w-full max-w-sm object-contain"
          />
        </div>
      </section>

      <section className="bg-secondary px-4 py-10 sm:px-5 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-extrabold tracking-widest text-primary">DEMONSTRAÇÃO DO MATERIAL</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">Veja o material por dentro</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Confira algumas páginas reais das apostilas que fazem parte da apostila.
          </p>
          <MaterialCarousel />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">Tudo o que você precisa para começar pela base</h2>
          <p className="mt-3 text-muted-foreground">Uma apostila com conteúdos essenciais organizados para estudo e revisão.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div key={subject.key} className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border">
              <h3 className="font-display text-xl font-extrabold text-brand-dark">{subject.label.toUpperCase()}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{content[subject.key].description}</p>
              <ul className="mt-5 space-y-2">
                {content[subject.key].topics.slice(0, 6).map((topic) => (
                  <li key={topic} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
                    {topic}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-bold text-primary">+ conteúdos essenciais</p>
            </div>
          ))}
          {[
            ["CONTEÚDO ORGANIZADO PARA ESTUDO", "Os assuntos reunidos de forma organizada para facilitar sua rotina de estudos."],
            ["MATERIAL PARA REVISÃO", "Um material para retomar os principais assuntos e reforçar sua base."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-3xl bg-secondary p-6 ring-1 ring-border">
              <h3 className="font-display text-xl font-extrabold text-brand-dark">{title}</h3>
              <p className="mt-3 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary px-4 py-10 sm:px-5 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">O que você vai estudar</h2>
          <div className="mt-8 space-y-3">
            {subjects.map((subject) => (
              <Accordion key={subject.key} type="single" collapsible className="rounded-2xl border border-border bg-card px-5">
                <AccordionItem value={subject.key} className="border-0">
                  <AccordionTrigger className="font-display font-extrabold text-brand-dark">{subject.label}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-2 pb-3 sm:grid-cols-2">
                      {content[subject.key].topics.map((topic) => (
                        <li key={topic} className="flex gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-20">
        <h2 className="text-center font-display text-3xl font-extrabold text-brand-dark">Para quem esse material é?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["PARA QUEM ESTÁ COMEÇANDO", "Quer começar a estudar, mas ainda não sabe como organizar as matérias básicas."],
            ["PARA QUEM ESTÁ DESORGANIZADO", "Já estuda, mas sente que os conteúdos estão espalhados."],
            ["PARA QUEM PRECISA REVISAR", "Quer retomar conteúdos básicos e reforçar a preparação."],
            ["PARA QUEM QUER PRATICIDADE", "Prefere ter os principais conteúdos organizados em um único material."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
              <h3 className="font-display font-extrabold text-brand-dark">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary px-4 py-10 sm:px-5 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
            <h2 className="font-display text-2xl font-extrabold text-brand-dark">O problema não é só estudar. É saber o que estudar.</h2>
            <p className="mt-4 text-muted-foreground">
              Quem começa a preparação para concursos pode acabar pulando entre vídeos, sites, PDFs e conteúdos diferentes, sem uma sequência clara.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {["Conteúdos espalhados", "Dificuldade para saber por onde começar", "Revisão desorganizada", "Muito tempo procurando material"].map((item) => (
                <li key={item}>❌ {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-primary p-7 text-primary-foreground shadow-soft">
            <h2 className="font-display text-2xl font-extrabold">Com a Apostila Básicas</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {["Português organizado", "Matemática organizada", "Informática organizada", "Material para estudo", "Material para revisão"].map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="veja-o-valor-do-pacote" className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-20">
        <h2 className="text-center font-display text-3xl font-extrabold text-brand-dark">Veja o valor do pacote</h2>
        <div className="mt-8 divide-y divide-border rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border">
          {valueItems.map((item) => (
            <div key={item} className="flex items-center justify-between gap-4 py-4">
              <span className="font-semibold">{item}</span>
              <span className="shrink-0 font-bold text-muted-foreground line-through">R$29,90</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-5">
            <span className="font-display text-xl font-extrabold text-brand-dark">VALOR TOTAL</span>
            <span className="font-display text-2xl font-extrabold text-muted-foreground line-through">R$149,50</span>
          </div>
        </div>
        <div className="mt-8">
          <OfferCard />
        </div>
      </section>


      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-20">
        <h2 className="text-center font-display text-3xl font-extrabold text-brand-dark">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card px-5">
          {[
            ["Quais matérias estão incluídas?", "A apostila inclui Língua Portuguesa, Matemática e Informática."],
            ["O material é digital?", "Sim. O produto é disponibilizado em formato digital."],
            ["Posso estudar pelo celular?", "Sim. O material pode ser acessado em dispositivos compatíveis com a leitura do arquivo."],
            ["Esse material é específico para algum concurso?", "Não. A apostila foi desenvolvida como material de preparação, com foco em Língua Portuguesa, Matemática e Informática."],
            ["A apostila é um curso completo?", "Não. É um material digital de apoio para estudo e revisão das matérias essenciais."],
            ["O pagamento é único?", "Sim. O valor apresentado corresponde à aquisição da apostila."],
            ["Quando recebo o material?", "Após a confirmação da compra, o acesso será disponibilizado conforme as condições apresentadas no checkout."],
          ].map(([question, answer], index) => (
            <AccordionItem key={question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold">{question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="bg-secondary px-4 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
          <ShieldCheck className="h-9 w-9 shrink-0 text-primary" />
          <div>
            <h2 className="font-display font-extrabold text-brand-dark">Compra segura</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pagamento seguro · Acesso digital · Produto entregue conforme as condições do checkout.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-20">
        <OfferCard final />
      </section>

      <footer className="border-t border-border bg-card px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">Material digital de apoio para preparação para concursos.</p>
        </div>
      </footer>

      {showStickyCta && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-3 shadow-soft backdrop-blur sm:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-muted-foreground">APOSTILA COMPLETA</p>
              <p className="font-display text-lg font-extrabold text-cta">R$37,90</p>
            </div>
            <CheckoutButton className="flex-1 px-4 py-4 text-sm">QUERO AGORA</CheckoutButton>
          </div>
        </div>
      )}
    </main>
  );
}