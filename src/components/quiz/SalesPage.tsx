import { useEffect, useMemo, useState } from "react";
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

function CheckoutButton({ children = "QUERO O PACOTE COMPLETO", className }: { children?: React.ReactNode; className?: string }) {
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
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative mx-auto flex max-w-4xl items-center justify-center gap-3 overflow-hidden px-10 sm:px-16">
        <button
          type="button"
          aria-label="Página anterior"
          onClick={() => move(-1)}
          className="absolute left-1 z-10 grid h-10 w-10 place-items-center rounded-full bg-card text-primary shadow-soft ring-1 ring-border"
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
              className={cn(
                "max-h-[540px] w-full max-w-sm rounded-2xl object-contain shadow-soft transition-all duration-700",
                index === active ? "scale-100 opacity-100" : "hidden scale-95 opacity-0",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Próxima página"
          onClick={() => move(1)}
          className="absolute right-1 z-10 grid h-10 w-10 place-items-center rounded-full bg-card text-primary shadow-soft ring-1 ring-border"
        >
          ›
        </button>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-muted-foreground">Material real do pacote</p>
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

  const heroImages = useMemo(() => images.slice(0, 3), []);

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo size="sm" />
          <span className="hidden text-sm font-bold text-muted-foreground sm:block">Material digital para concursos</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-secondary px-4 py-2 text-xs font-extrabold tracking-widest text-primary">
            PACOTE BÁSICAS PARA CONCURSOS
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-brand-dark sm:text-6xl">
            Comece sua preparação pelas matérias básicas.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Português, Matemática e Informática organizados em um único pacote para você estudar e revisar.
          </p>
          <p className="mt-4 text-sm font-semibold text-muted-foreground">Material digital · Acesso imediato</p>
          <CheckoutButton className="mt-7 w-full sm:w-auto" />
          <p className="mt-4 font-display text-xl font-extrabold text-cta">Por apenas R$37,90</p>
        </div>

        <div className="flex items-end justify-center gap-[-8px] overflow-hidden py-4">
          {heroImages.map((image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.label}
              className={cn(
                "w-[38%] rounded-xl object-contain shadow-soft ring-1 ring-border",
                index === 0 && "-rotate-6",
                index === 1 && "relative z-10 -translate-y-4",
                index === 2 && "rotate-6",
              )}
            />
          ))}
        </div>
      </section>

      <section className="bg-secondary px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-extrabold tracking-widest text-primary">DEMONSTRAÇÃO DO MATERIAL</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">Veja o material por dentro</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Confira algumas páginas reais das apostilas que fazem parte do pacote.
          </p>
          <MaterialCarousel />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">Tudo o que você precisa para começar pela base</h2>
          <p className="mt-3 text-muted-foreground">Um pacote com conteúdos essenciais organizados para estudo e revisão.</p>
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

      <section className="bg-secondary px-5 py-14 sm:py-20">
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

      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
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

      <section className="bg-secondary px-5 py-14 sm:py-20">
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
            <h2 className="font-display text-2xl font-extrabold">Com o Pacote Básicas</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {["Português organizado", "Matemática organizada", "Informática organizada", "Material para estudo", "Material para revisão"].map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
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

      <section className="bg-secondary px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-brand-dark">Você sabe exatamente o que está levando.</h2>
          <p className="mt-3 text-muted-foreground">Veja novamente algumas páginas reais do material.</p>
          <MaterialCarousel />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <h2 className="text-center font-display text-3xl font-extrabold text-brand-dark">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card px-5">
          {[
            ["Quais matérias estão incluídas?", "O pacote inclui Língua Portuguesa, Matemática e Informática."],
            ["O material é digital?", "Sim. O produto é disponibilizado em formato digital."],
            ["Posso estudar pelo celular?", "Sim. O material pode ser acessado em dispositivos compatíveis com a leitura do arquivo."],
            ["Esse material é específico para algum concurso?", "Não. O pacote foi desenvolvido como material básico de preparação, com foco em Língua Portuguesa, Matemática e Informática."],
            ["O pacote é um curso completo?", "Não. É um material digital de apoio para estudo e revisão das matérias básicas."],
            ["O pagamento é único?", "Sim. O valor apresentado corresponde à aquisição do pacote."],
            ["Quando recebo o material?", "Após a confirmação da compra, o acesso será disponibilizado conforme as condições apresentadas no checkout."],
          ].map(([question, answer], index) => (
            <AccordionItem key={question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold">{question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="bg-secondary px-5 py-10">
        <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
          <ShieldCheck className="h-9 w-9 shrink-0 text-primary" />
          <div>
            <h2 className="font-display font-extrabold text-brand-dark">Compra segura</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pagamento seguro · Acesso digital · Produto entregue conforme as condições do checkout.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
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
              <p className="truncate text-xs font-bold text-muted-foreground">PACOTE COMPLETO</p>
              <p className="font-display text-lg font-extrabold text-cta">R$37,90</p>
            </div>
            <CheckoutButton className="flex-1 px-4 py-4 text-sm">QUERO AGORA</CheckoutButton>
          </div>
        </div>
      )}
    </main>
  );
}