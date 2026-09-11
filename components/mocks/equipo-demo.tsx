"use client";

import { Hash, ImageIcon, Plus, SendHorizontal } from "lucide-react";
import { AppButton, AppSurface, Avatar } from "@/components/mocks/app-ui";
import { BrowserFrame } from "@/components/mocks/browser-frame";
import { useDemoStep, useInView } from "@/hooks/use-in-view";
import { demoTeam } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

// Same order as the Avatar palette in app-ui, so a person keeps one color.
const personColors = ["#1b3a2d", "#4a9d7c", "#7a5b12"];

type Task = {
  id: string;
  title: string;
  owner: number;
  helpers?: number[];
  due: string;
  overdue?: boolean;
  shots?: number;
};

const traveler: Task = {
  id: "guia",
  title: "Confirmar guía de C-0771",
  owner: 1,
  helpers: [2],
  due: "11 sep",
  shots: 1,
};

const pending: Task[] = [
  { id: "saldo", title: "Llamar a Clínica del Parque por su saldo", owner: 0, due: "8 sep", overdue: true },
  { id: "lotes", title: "Registrar lotes de la compra 1142", owner: 2, due: "15 sep", shots: 2 },
];
const inProgress: Task[] = [
  { id: "timbrar", title: "Timbrar factura de C-0758", owner: 2, helpers: [0], due: "10 sep" },
];
const done: Task[] = [
  { id: "estados", title: "Enviar estados de cuenta del mes", owner: 1, due: "5 sep" },
];

function TaskCard({ task, entering = false }: { task: Task; entering?: boolean }) {
  const color = personColors[task.owner];
  return (
    <div
      className={cn(
        "rounded-xl border-[1.5px] bg-white p-2",
        entering && "animate-in fade-in slide-in-from-left-6 duration-500",
      )}
      style={{ borderColor: `${color}55` }}
    >
      <p className="line-clamp-2 text-[11px] font-medium">{task.title}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className="flex items-center gap-1 rounded-full py-0.5 pr-1.5 pl-0.5 text-[9.5px] font-medium"
          style={{ backgroundColor: `${color}14`, color }}
        >
          <Avatar
            initials={demoTeam[task.owner].initials}
            tone={task.owner}
            className="size-3.5 text-[6.5px] ring-0"
          />
          {demoTeam[task.owner].name}
        </span>
        {task.helpers?.map((helper) => (
          <Avatar
            key={helper}
            initials={demoTeam[helper].initials}
            tone={helper}
            className="-ml-1 size-3.5 text-[6.5px] ring-1"
          />
        ))}
        {task.shots ? (
          <span className="flex items-center gap-0.5 text-[9.5px] text-app-faint">
            <ImageIcon className="size-2.5" />
            {task.shots}
          </span>
        ) : null}
        <span
          className={cn(
            "ml-auto text-[9.5px] font-medium",
            task.overdue ? "text-app-red" : "text-app-muted",
          )}
        >
          {task.due}
        </span>
      </div>
    </div>
  );
}

type Message = { from: number; text: React.ReactNode; time: string };

function Mention({ children, mine = false }: { children: React.ReactNode; mine?: boolean }) {
  return (
    <span className={cn("font-semibold", mine ? "text-app-green-200" : "text-app-accent")}>
      {children}
    </span>
  );
}

const messages: Message[] = [
  { from: 2, text: "Lotes de la compra registrados ✓", time: "9:15" },
  {
    from: 0,
    text: (
      <>
        <Mention mine>@Ana</Mention> ¿ya salió la guía de C-0771?
      </>
    ),
    time: "10:42",
  },
  { from: 1, text: "Sí, va por FedEx con sus 3 lotes 🚚", time: "10:44" },
  {
    from: 2,
    text: (
      <>
        Perfecto <Mention>@Braulio</Mention>, el cliente ya la puede rastrear.
      </>
    ),
    time: "10:45",
  },
];

// Braulio is the signed-in user in this demo.
const ME = 0;

function Bubble({ message }: { message: Message }) {
  const mine = message.from === ME;
  return (
    <div
      className={cn(
        "flex animate-in items-end gap-1.5 fade-in slide-in-from-bottom-2 duration-500",
        mine && "flex-row-reverse",
      )}
    >
      {mine ? null : (
        <Avatar initials={demoTeam[message.from].initials} tone={message.from} className="ring-0" />
      )}
      <div className={cn("max-w-[80%]", mine && "text-right")}>
        {mine ? null : (
          <p className="mb-0.5 text-[9.5px] text-app-muted">{demoTeam[message.from].name}</p>
        )}
        <p
          className={cn(
            "inline-block rounded-2xl px-2.5 py-1.5 text-left text-[11px]",
            mine ? "rounded-br-md bg-app-primary text-white" : "rounded-bl-md bg-app-fill",
          )}
        >
          {message.text}
        </p>
      </div>
      <span className="pb-1 text-[9px] text-app-faint">{message.time}</span>
    </div>
  );
}

export function EquipoDemo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 asked in chat · 1 task started, Ana typing · 2 Ana answers · 3 task done · 4 hold
  const step = useDemoStep(5, 1800, inView);
  const column = step === 0 ? 0 : step < 3 ? 1 : 2;
  // The first message is from earlier in the day and is always there.
  const visibleMessages = step === 0 || step === 1 ? 2 : step === 2 ? 3 : 4;

  const board = [
    { title: "Pendiente", dot: "#9ca3af", tasks: pending },
    { title: "En Progreso", dot: "#4a9d7c", tasks: inProgress },
    { title: "Completada", dot: "#1b3a2d", tasks: done },
  ];

  return (
    <div ref={ref} className={cn("flex flex-col gap-4 md:flex-row md:items-start", className)}>
      <BrowserFrame path="tareas" className="w-[620px] shrink-0">
        <AppSurface className="h-[236px] bg-white p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-[15px] font-semibold tracking-[-0.02em]">Tareas</p>
              <div className="flex gap-1">
                {["Todos", ...demoTeam.map((person) => person.name)].map((name, i) => (
                  <span
                    key={name}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      i === 0 ? "bg-app-primary text-white" : "bg-app-fill text-app-muted",
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <AppButton className="py-1">
              <Plus className="size-3" /> Nueva Tarea
              <span className="rounded bg-white/15 px-1 text-[9px]">N</span>
            </AppButton>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {board.map((col, index) => {
              const hasTraveler = index === column;
              return (
                <div key={col.title} className="rounded-xl bg-app-fill p-1.5">
                  <div className="flex items-center gap-1.5 px-1 pt-0.5 pb-1.5">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: col.dot }} />
                    <span className="text-[11px] font-semibold">{col.title}</span>
                    <span className="ml-auto rounded-full bg-white px-1.5 text-[10px] text-app-muted">
                      {col.tasks.length + (hasTraveler ? 1 : 0)}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {hasTraveler ? (
                      <TaskCard key={`${traveler.id}-${index}`} task={traveler} entering={index > 0} />
                    ) : null}
                    {col.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </AppSurface>
      </BrowserFrame>

      <BrowserFrame path="chat" className="w-full shrink-0 md:w-[380px]">
        <AppSurface className="flex h-[236px] flex-col bg-white">
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2.5">
            <span className="grid size-6 place-items-center rounded-lg bg-app-green-50 text-app-primary">
              <Hash className="size-3.5" />
            </span>
            <div>
              <p className="text-[12px] font-semibold">Entregas</p>
              <p className="text-[9.5px] text-app-muted">Grupo · 3 miembros</p>
            </div>
            <div className="ml-auto flex">
              {demoTeam.map((person, i) => (
                <Avatar key={person.initials} initials={person.initials} tone={i} className="-ml-1" />
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-3.5 py-2.5">
            {messages.slice(0, visibleMessages).map((message) => (
              <Bubble key={message.time} message={message} />
            ))}
            {step === 1 ? (
              <div className="flex animate-in items-center gap-1.5 fade-in duration-300">
                <Avatar initials={demoTeam[1].initials} tone={1} className="ring-0" />
                <span className="flex gap-0.5 rounded-2xl rounded-bl-md bg-app-fill px-2.5 py-2">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="size-1 animate-pulse rounded-full bg-app-faint"
                      style={{ animationDelay: `${dot * 160}ms` }}
                    />
                  ))}
                </span>
                <span className="text-[9.5px] text-app-faint">Ana está escribiendo…</span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 border-t border-black/[0.06] px-3.5 py-2">
            <span className="flex-1 truncate rounded-xl bg-app-fill px-2.5 py-1.5 text-[10.5px] text-app-faint">
              Escribe un mensaje… usa @ para mencionar
            </span>
            <span className="grid size-6 place-items-center rounded-full bg-app-primary text-white">
              <SendHorizontal className="size-3" />
            </span>
          </div>
        </AppSurface>
      </BrowserFrame>
    </div>
  );
}
