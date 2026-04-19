'use client';

import { useState } from 'react';

export default function ProductImage({ src }: { src: string }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      className="aspect-square overflow-hidden bg-slate-200"
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt="product"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{
          transform: zoom ? 'scale(2)' : 'scale(1)',
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      />
    </div>
  );
}