import { useId } from "react";

const words = [
  { text: "بِسْــمِ", right: 1040, width: 180 },
  { text: "اللَّهِ", right: 820, width: 150 },
  { text: "الرَّحْمَٰنِ", right: 630, width: 270 },
  { text: "الرَّحِيــمِ", right: 320, width: 280 },
];

export default function BismillahWriting({ onComplete }) {
  const id = useId().replace(/:/g, "");
  return <svg className="bismillah-writing" viewBox="0 0 1080 240" aria-hidden="true" focusable="false" onAnimationEnd={(event) => {
    if (event.animationName === "bismillah-outline" && event.target.dataset.writingLast === "true") onComplete?.();
  }}>
    <defs>
      <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ffe7a0" /><stop offset=".45" stopColor="#f4ba42" /><stop offset="1" stopColor="#e8a82c" />
      </linearGradient>
      {words.map((word, index) => <mask key={index} id={`${id}-word-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="240">
        <path className="bismillah-ink-mask" style={{ "--word-delay": `${.05 + index * (1.3 / 6)}s` }} d={`M ${word.right + 12} 110 Q ${word.right - word.width * .3} 80 ${word.right - word.width * .55} 120 T ${word.right - word.width - 12} 110`} pathLength="1" fill="none" stroke="white" strokeWidth="240" strokeLinecap="butt" />
      </mask>)}
    </defs>
    {words.map((word, index) => <g key={index} style={{ "--word-delay": `${.05 + index * (1.3 / 6)}s` }}>
      <text data-writing-last={index === words.length - 1} className="bismillah-word-outline" x={word.right} y="155" direction="rtl" textAnchor="start" textLength={word.width} lengthAdjust="spacingAndGlyphs" lang="ar">{word.text}</text>
      <text className="bismillah-word-ink" x={word.right} y="155" direction="rtl" textAnchor="start" textLength={word.width} lengthAdjust="spacingAndGlyphs" lang="ar" fill={`url(#${id}-ink)`} mask={`url(#${id}-word-${index})`}>{word.text}</text>
    </g>)}
    <g className="bismillah-pen">
      <circle r="12" fill="#ffe7a0" opacity=".18" />
      <path d="M 0 -9 L 4 0 L 0 9 L -4 0 Z" fill="#fff1c1" />
    </g>
  </svg>;
}
