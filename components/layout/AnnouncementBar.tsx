"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const INTERVAL_MS = 4000;
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Rotating announcements. One message at a time; the next slides up every 4s and the
 * list loops back to the first through a copy of it at the end. Pauses on hover, on
 * keyboard focus and with the pause button (WCAG 2.2.2). Static under reduced motion.
 */
export function AnnouncementBar({ messages }: { messages: string[] }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const canRotate = messages.length > 1 && !reducedMotion;
  const running = canRotate && !stopped && !hovered && !focused;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setAnimate(true);
      setStep((s) => s + 1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [running]);

  // After sliding onto the copy of the first message, jump back to the real first one.
  function onTransitionEnd() {
    if (step >= messages.length) {
      setAnimate(false);
      setStep(0);
    }
  }

  const items = canRotate ? [...messages, messages[0]] : messages.slice(0, 1);

  return (
    <section
      aria-label="Announcements"
      className="relative bg-blush text-mauve"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <p className="sr-only">{messages.join(". ")}</p>

      <div aria-hidden="true" className="h-11 overflow-hidden px-12">
        <ul
          onTransitionEnd={onTransitionEnd}
          className={cn("ticker-track", animate && "ticker-animate")}
          style={{ transform: `translateY(${step * -2.75}rem)` }}
        >
          {items.map((m, i) => (
            <li key={`${i}-${m}`} className="flex h-11 items-center justify-center">
              <span className="truncate text-micro font-semibold sm:text-small">{m}</span>
            </li>
          ))}
        </ul>
      </div>

      {messages.length > 1 && (
        <button
          type="button"
          onClick={() => setStopped((s) => !s)}
          aria-label={stopped ? "Play announcements" : "Pause announcements"}
          className="absolute top-0 right-1 grid size-11 place-items-center rounded-full text-mauve transition-colors hover:bg-blush-deep motion-reduce:hidden sm:right-3"
        >
          {stopped ? (
            <Play aria-hidden="true" className="size-4" strokeWidth={2} />
          ) : (
            <Pause aria-hidden="true" className="size-4" strokeWidth={2} />
          )}
        </button>
      )}
    </section>
  );
}
