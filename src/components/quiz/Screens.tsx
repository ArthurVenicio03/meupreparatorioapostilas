import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { AnswerCard, CTAButton, Logo, ProgressBar } from "./Primitives";
import {
  CHECKOUT_URL,
  STATUS_LABEL,
  type QuizQuestionData,
  type Subject,
  type SubjectStatus,
} from "@/lib/quiz-data";
import { track } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const enter = "animate-in fade-in slide-in-from-bottom-4 duration-500";

export function Opening({ onStart }: { onStart: () => void }) {
  return (
    <div className={cn("flex min-h-[80vh] flex-col items-center justify-center text-center", enter)}>
      <Logo />
      <h1 className="mt-10 font-display text-3xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
        Como está sua preparação para os concursos?
      </h1>
      <p className="mt-5 max-w-lg text-lg text-muted-foreground">
        Responda algumas perguntas rápidas e descubra como está sua base em Português, Matemática e Informática.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-primary">
        <Clock className="h-4 w-4" aria-hidden /> Leva menos de 2 minutos
      </div>
      <CTAButton className="mt-8 max-w-md" onClick={onStart}>COMEÇAR O QUIZ</CTAButton>
    </div>
  );
}

export function QuizQuestion({
  data,
  index,
  total,
  selected,
  onSelect,
  onBack,
}: {
  data: QuizQuestionData;
  index: number;
  total: number;
  selected: number | undefined;
  onSelect: (i: number) => void;
  onBack: () => void;
}) {
  const [locked, setLocked] = useState(false);
  useEffect(() => setLocked(false), [index]);

  return (
    <div key={data.id} className={enter}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
        </button>
        <Logo size="sm" />
      </div>
      <div className="mt-6">
        <ProgressBar current={index + 1} total={total} />
        <p className="mt-3 text-sm font-bold text-primary">Pergunta {index + 1} de {total}</p>
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold leading-snug text-brand-dark sm:text-3xl">{data.question}</h2>
      <div className="mt-8 flex flex-col gap-3">
        {data.options.map((opt, i) => (
          <AnswerCard
            key={opt.label}
            label={opt.label}
            selected={selected === i}
            disabled={locked}
            onSelect={() => {
              setLocked(true);
              onSelect(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function NameStep({
  initial,
  onSubmit,
  onBack,
}: {
  initial: string;
  onSubmit: (nome: string) => void;
  onBack: () => void;
}) {
  const [nome, setNome] = useState(initial);
  const [error, setError] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clean = nome.trim().replace(/\s+/g, " ");
    if (clean.length < 2) return setError(true);
    onSubmit(clean.slice(0, 60));
  };
  return (
    <form onSubmit={submit} className={enter} noValidate>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
        </button>
        <Logo size="sm" />
      </div>
      <label htmlFor="nome_lead" className="mt-10 block font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
        Qual é o seu nome?
      </label>
      <input
        id="nome_lead"
        name="nome_lead"
        autoFocus
        required
        autoComplete="given-name"
        maxLength={60}
        value={nome}
        onChange={(e) => {
          setNome(e.target.value);
          setError(false);
        }}
        aria-invalid={error}
        aria-describedby={error ? "nome_erro" : undefined}
        placeholder="Digite seu nome"
        className="mt-6 w-full rounded-2xl border-2 border-border bg-card p-5 text-lg font-semibold text-foreground shadow-soft outline-none transition-colors focus:border-primary"
      />
      {error && (
        <p id="nome_erro" className="mt-2 text-sm font-semibold text-cta">
          Informe seu nome para continuar.
        </p>
      )}
      <CTAButton type="submit" className="mt-6">CONTINUAR</CTAButton>
    </form>
  );
}

export function ProcessingScreen({ nome }: { nome: string }) {
  return (
    <div className={cn("flex min-h-[70vh] flex-col items-center justify-center text-center", enter)} role="status">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" aria-hidden />
      <h2 className="mt-8 font-display text-2xl font-extrabold text-brand-dark">Perfeito, {nome}! Analisando suas respostas...</h2>
      <p className="mt-2 text-muted-foreground">Identificando seus principais pontos de atenção...</p>
    </div>
  );
}

const SUBJECT_LABEL: Record<Subject, string> = {
  portugues: "PORTUGUÊS",
  matematica: "MATEMÁTICA",
  informatica: "INFORMÁTICA",
};
const STATUS_STYLE: Record<SubjectStatus, { badge: string; bar: string; w: string }> = {
  atencao: { badge: "bg-cta/10 text-cta", bar: "bg-cta", w: "w-1/3" },
  revisar: { badge: "bg-warning/15 text-warning-foreground", bar: "bg-warning", w: "w-2/3" },
  boa: { badge: "bg-primary/10 text-primary", bar: "bg-primary", w: "w-full" },
};

export function DiagnosisResult({ diagnosis, nome }: { diagnosis: Record<Subject, SubjectStatus>; nome: string }) {
  return (
    <section className={enter}>
      <div className="text-center">
        <Logo size="sm" />
      </div>
      <h1 className="mt-8 text-center font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
        {nome}, seu diagnóstico está pronto
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
        Suas respostas mostram que fortalecer a base pode deixar sua preparação mais organizada e eficiente.
      </p>
      <div className="mt-8 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:p-8">
        <p className="text-sm font-extrabold tracking-widest text-primary">SEU FOCO DE PREPARAÇÃO</p>
        <ul className="mt-5 space-y-5">
          {(Object.keys(diagnosis) as Subject[]).map((s) => {
            const st = STATUS_STYLE[diagnosis[s]];
            return (
              <li key={s}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display font-extrabold text-brand-dark">{SUBJECT_LABEL[s]}</span>
                  <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-bold", st.badge)}>
                    {STATUS_LABEL[diagnosis[s]]}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", st.bar, st.w)} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-6 rounded-3xl bg-secondary p-6 sm:p-8">
        <h2 className="font-display text-xl font-extrabold text-brand-dark">Por que fortalecer essas matérias?</h2>
        <p className="mt-3 text-muted-foreground">
          Língua Portuguesa, Matemática e Informática aparecem com frequência na preparação para concursos e formam uma
          base importante para quem está começando ou precisa revisar os principais conteúdos.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Orientação de estudo baseada exclusivamente nas suas respostas.
        </p>
      </div>
    </section>
  );
}

const ITEMS = [
  "Língua Portuguesa",
  "Matemática",
  "Informática",
  "Conteúdo organizado para estudo",
  "Material para revisão",
] as const;

export function ApostilaOffer({ nome }: { nome: string }) {
  useEffect(() => track("offer_viewed"), []);
  return (
    <section className={cn("mt-16", enter)}>
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
          Agora você já sabe onde precisa concentrar sua atenção.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Para facilitar sua preparação, {nome}, reunimos os principais conteúdos básicos em um material organizado para estudo e
          revisão.
        </p>
      </div>
      <div className="mt-10 overflow-hidden rounded-3xl bg-brand-dark p-6 text-primary-foreground shadow-soft sm:p-10">
        <h2 className="text-center font-display text-3xl font-extrabold">{nome}, comece fortalecendo sua base</h2>
        <p className="mx-auto mt-3 max-w-md text-center opacity-80">
          Tenha um material organizado para estudar e revisar Português, Matemática e Informática.
        </p>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
          <div className="mx-auto w-48 rotate-[-4deg] rounded-r-2xl rounded-l-md bg-primary p-5 shadow-2xl ring-4 ring-primary-foreground/10 sm:w-56">
            <div className="h-2 w-10 rounded bg-cta" />
            <p className="mt-6 text-xs font-bold opacity-70">MEU PREPARATÓRIO</p>
            <p className="mt-2 font-display text-2xl font-extrabold leading-tight">APOSTILA BÁSICA</p>
            <p className="mt-8 text-[11px] leading-relaxed opacity-80">Português · Matemática · Informática</p>
          </div>
          <ul className="space-y-3">
            {ITEMS.map((it) => (
              <li key={it} className="flex items-center gap-3 font-semibold">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cta">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                {it}
              </li>
            ))}
          </ul>
        </div>
        <CTAButton
          className="mt-10"
          onClick={() => {
            track("checkout_clicked");
            window.location.href = CHECKOUT_URL;
          }}
        >
          QUERO MINHA APOSTILA
        </CTAButton>
        <p className="mt-4 text-center text-sm opacity-80">Comece agora sua preparação pelas matérias básicas.</p>
      </div>
    </section>
  );
}
