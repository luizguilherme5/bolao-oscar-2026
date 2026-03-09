"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
}

export default function Toast({ message, show, onHide }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast">
      <div className="glass-card-bright rounded-full px-6 py-3 flex items-center gap-2 shadow-xl">
        <span className="text-lg">✨</span>
        <span className="text-sm font-semibold font-body text-white">{message}</span>
      </div>
    </div>
  );
}
