'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    const handleDown = () => setIsActive(true);
    const handleUp = () => setIsActive(false);
    const handlePointer = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsPointer(
        !!(el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a') || el.closest('button'))
      );
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('mousemove', handlePointer, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('mousemove', handlePointer);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor z-[99999] fixed top-0 left-0 pointer-events-none ${
        isPointer ? 'cursor-pointer-style' : 'cursor-arrow-style'
      } ${isActive ? 'cursor-active-style' : ''}`}
      style={{ width: 24, height: 24 }}
    />
  );
} 