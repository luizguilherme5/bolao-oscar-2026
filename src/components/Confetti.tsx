"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  shape: "square" | "circle" | "star";
}

const COLORS = ["#FF2D78", "#FFD700", "#7C3AED", "#3B82F6", "#FF6B35", "#10B981"];

export default function Confetti({ count = 30 }: { count?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      shape: (["square", "circle", "star"] as const)[Math.floor(Math.random() * 3)],
    }));
    setPieces(newPieces);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.shape === "circle" ? piece.size : piece.size * 0.6,
            backgroundColor: piece.color,
            borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "star" ? "2px" : "1px",
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s infinite`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}
