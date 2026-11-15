import { useState } from "react";

const lines = [
  ["Mengalirkan", "Berkah,"],
  ["Merawat", "Martabat", "&"],
  ["Kemandirian", "Umat"],
];

export default function InteractiveHeroTitle({ ready = true }) {
  const [replay, setReplay] = useState(0);
  return <h1 className="hero-title" data-ready={ready}>
    <button type="button" disabled={!ready} className="hero-title-replay" onClick={() => setReplay(value => value + 1)} title="Klik untuk memutar ulang animasi judul" aria-label="Mengalirkan Berkah, Merawat Martabat & Kemandirian Umat. Putar ulang animasi judul">
      <span key={replay} aria-hidden="true">
        {lines.map((words, line) => <span key={line} className={`hero-title-line${line === 1 ? " hero-title-accent" : ""}`}>
          {words.map((word, index) => <span key={word}>
            {index > 0 && " "}<span className="hero-title-word" style={{ "--word-index": lines.slice(0, line).reduce((count, items) => count + items.length, 0) + index }}><span>{word}</span></span>
          </span>)}
        </span>)}
      </span>
    </button>
  </h1>;
}
