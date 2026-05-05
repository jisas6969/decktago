'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTutorial } from '@/hooks/useTutorial';
import { useAuth } from '@/app/context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TUTORIAL_STEPS } from '@/app/context/TutorialContext';

type Rect = { top: number; left: number; width: number; height: number };

export default function TutorialOverlay() {
  const {
    step,
    isTutorialActive,
    currentConfig,
    nextStep,
    endTutorial,
    setShouldOpenAddressModal,
    setShouldCloseAddressModal,
  } = useTutorial();

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [rects, setRects] = useState<Rect[]>([]);
  const [primaryRect, setPrimaryRect] = useState<Rect | null>(null);
  const [visible, setVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<'bottom' | 'top'>('bottom');
  const retryRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>(0);

  // ─── Measure target elements ─────────────────────────────────
  const measure = useCallback(() => {
    if (!currentConfig) return;

    const measured: Rect[] = [];
    let primary: Rect | null = null;

    for (const id of currentConfig.elementIds) {
      const el = document.getElementById(id);
      if (el) {
        const r = el.getBoundingClientRect();
        const rect = {
          top: r.top + window.scrollY,
          left: r.left + window.scrollX,
          width: r.width,
          height: r.height,
        };
        measured.push(rect);
        if (!primary) primary = rect;
      }
    }

    if (measured.length > 0) {
      setRects(measured);
      setPrimaryRect(primary);
      setVisible(true);

      if (primary) {
        const spaceBelow = window.innerHeight - (primary.top - window.scrollY + primary.height);
        setTooltipPos(spaceBelow > 220 ? 'bottom' : 'top');
      }
    }
  }, [currentConfig]);

  // ─── Find elements & scroll into view ────────────────────────
  useEffect(() => {
    if (!isTutorialActive || !currentConfig) {
      setVisible(false);
      return;
    }

    const isCorrectPage =
      currentConfig.page === pathname ||
      (currentConfig.page.startsWith('/orders/') && pathname.startsWith('/orders/'));

    if (!isCorrectPage) {
      setVisible(false);
      return;
    }

    let attempts = 0;

    const tryFind = () => {
      const firstEl = document.getElementById(currentConfig.elementIds[0]);
      if (firstEl) {
        firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(measure, 400);
      } else if (attempts < 30) {
        attempts++;
        retryRef.current = setTimeout(tryFind, 200);
      }
    };

    retryRef.current = setTimeout(tryFind, 300);
    return () => { if (retryRef.current) clearTimeout(retryRef.current); };
  }, [isTutorialActive, currentConfig, pathname, measure]);
  const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1;   // speed (0.5–2)
  utterance.pitch = 1;  // tone
  utterance.lang = 'en-US'; // or 'fil-PH'

  window.speechSynthesis.cancel(); // stop previous
  window.speechSynthesis.speak(utterance);
};
useEffect(() => {
  if (!isTutorialActive || !currentConfig) return;

  speak(currentConfig.tooltip);
}, [step, isTutorialActive, currentConfig]);

  // ─── Recalc on resize/scroll ─────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const update = () => { rafRef.current = requestAnimationFrame(measure); };
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, measure]);
  useEffect(() => {
  if (!isTutorialActive) return;

  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';

  return () => {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };
}, [isTutorialActive]);


  // ─── Finish tutorial (Firestore + cleanup) ───────────────────
  const finishTutorial = useCallback(async () => {
    if (user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { hasSeenTutorial: true });
      } catch (err) {
        console.error('Error finishing tutorial:', err);
      }
    }
    endTutorial();
    router.push('/');
  }, [user, endTutorial, router]);

  // ─── Handle Next ─────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (!currentConfig) return;

    if (currentConfig.isFinal) {
      finishTutorial();
      return;
    }

    // Fire beforeNext actions
    if (currentConfig.beforeNext === 'open-address-modal') {
      setShouldOpenAddressModal(true);
    }
    if (currentConfig.beforeNext === 'close-address-modal') {
      setShouldCloseAddressModal(true);
    }

    const nextStepIndex = step; // 1-indexed → next config at [step]
    const nextConfig = TUTORIAL_STEPS[nextStepIndex];

    // Special: Orders → Order Detail (dynamic route)
    if (step === 5 && pathname === '/orders') {
      const orderCard = document.getElementById('order-card');
      const link = orderCard?.closest('a');
      const href = link?.getAttribute('href');
      setVisible(false);
      nextStep();
      if (href) router.push(href);
      return;
    }

    if (nextConfig && nextConfig.page !== pathname) {
      setVisible(false);
      nextStep();
      router.push(nextConfig.page);
    } else {
      setVisible(false);
      nextStep();
    }
  }, [currentConfig, step, pathname, nextStep, router, finishTutorial, setShouldOpenAddressModal, setShouldCloseAddressModal]);

  // ─── Don't render if inactive ────────────────────────────────
  if (!isTutorialActive || !visible || !currentConfig || !primaryRect) return null;

  const PAD = 12;
  const allLeft = Math.min(...rects.map((r) => r.left)) - PAD;
  const allTop = Math.min(...rects.map((r) => r.top)) - PAD;
  const allRight = Math.max(...rects.map((r) => r.left + r.width)) + PAD;
  const allBottom = Math.max(...rects.map((r) => r.top + r.height)) + PAD;
  const spotW = allRight - allLeft;
  const spotH = allBottom - allTop;

  // Tooltip position
  const tooltipStyle: React.CSSProperties = {};
  const arrowStyle: React.CSSProperties = {};
  if (tooltipPos === 'bottom') {
    tooltipStyle.top = (allBottom - window.scrollY) + 16;
    tooltipStyle.left = (allLeft - window.scrollX) + spotW / 2;
    tooltipStyle.transform = 'translateX(-50%)';
    arrowStyle.top = -8;
    arrowStyle.left = '50%';
    arrowStyle.transform = 'translateX(-50%) rotate(45deg)';
  } else {
    tooltipStyle.top = (allTop - window.scrollY) - 16;
    tooltipStyle.left = (allLeft - window.scrollX) + spotW / 2;
    tooltipStyle.transform = 'translateX(-50%) translateY(-100%)';
    arrowStyle.bottom = -8;
    arrowStyle.left = '50%';
    arrowStyle.transform = 'translateX(-50%) rotate(45deg)';
  }

  const cutTop = allTop - window.scrollY;
  const cutLeft = allLeft - window.scrollX;
  const cutRight = allRight - window.scrollX;
  const cutBottom = allBottom - window.scrollY;

  return (
    <div className="tutorial-overlay-root" style={{ position: 'fixed', inset: 0, zIndex: 99999 }}>

      {/* 1) Full click-blocker (blocks ALL page interaction) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 99998, pointerEvents: 'auto' }} />

      {/* 2) Dark overlay with visual spotlight cutout */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          pointerEvents: 'none',
          zIndex: 99999,
          clipPath: `polygon(
            0% 0%, 0% 100%,
            ${cutLeft}px 100%, ${cutLeft}px ${cutTop}px,
            ${cutRight}px ${cutTop}px, ${cutRight}px ${cutBottom}px,
            ${cutLeft}px ${cutBottom}px, ${cutLeft}px 100%,
            100% 100%, 100% 0%
          )`,
        }}
      />

      {/* 3) Spotlight glow ring */}
      <div
        className="tutorial-spotlight-ring"
        style={{
          position: 'fixed',
          top: cutTop,
          left: cutLeft,
          width: spotW,
          height: spotH,
          borderRadius: 12,
          border: '2px solid rgba(39, 135, 180, 0.8)',
          boxShadow: '0 0 0 4px rgba(39, 135, 180, 0.25), 0 0 30px rgba(39, 135, 180, 0.3)',
          pointerEvents: 'none',
          zIndex: 100000,
        }}
      />

      {/* 4) Tooltip */}
      <div
        className="tutorial-tooltip"
        style={{ position: 'fixed', ...tooltipStyle, pointerEvents: 'auto', zIndex: 100001 }}
      >
        {/* Arrow */}
        <div style={{ position: 'absolute', width: 16, height: 16, background: '#1e293b', ...arrowStyle }} />

        {/* Card */}
        <div
          style={{
            position: 'relative',
            background: '#1e293b',
            borderRadius: 12,
            padding: '20px 24px',
            minWidth: 280,
            maxWidth: 380,
            color: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          {/* Step indicator + progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: '50%', background: '#2787b4',
                fontSize: 12, fontWeight: 700,
              }}
            >
              {step}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              of {TUTORIAL_STEPS.length}
            </span>
            <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: i < step ? '#2787b4' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Demo mode badge */}
          <div style={{
            display: 'inline-block', background: 'rgba(39,135,180,0.2)', border: '1px solid rgba(39,135,180,0.4)',
            borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#7ec8e3', marginBottom: 8,
          }}>
            DEMO MODE
          </div>

          {/* Tooltip message */}
          <p style={{ fontSize: 15, lineHeight: 1.5, margin: '8px 0 16px' }}>
            {currentConfig.tooltip}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={finishTutorial}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontSize: 13, padding: '4px 0',
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              Skip tutorial
            </button>
            <button
              onClick={handleNext}
              style={{
                background: '#2787b4', border: 'none', borderRadius: 8,
                color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                padding: '8px 20px', boxShadow: '0 2px 8px rgba(39,135,180,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#1f6f94';
                (e.target as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = '#2787b4';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {currentConfig.nextLabel || 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}