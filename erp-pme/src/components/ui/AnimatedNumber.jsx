import { useEffect, useRef, useState } from 'react';

const prefereReduzido = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Conta de 0 (ou do valor anterior) até `valor` com easing suave.
 * `formato` recebe o número atual e devolve a string exibida (ex.: moeda).
 */
export default function AnimatedNumber({ valor = 0, formato = (n) => Math.round(n), duracao = 900 }) {
  const [atual, setAtual] = useState(prefereReduzido() ? valor : 0);
  const deRef = useRef(0);
  const rafRef = useRef();

  useEffect(() => {
    if (prefereReduzido()) {
      setAtual(valor);
      return;
    }
    const de = deRef.current;
    const inicio = performance.now();
    const passo = (agora) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setAtual(de + (valor - de) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(passo);
      else deRef.current = valor;
    };
    rafRef.current = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(rafRef.current);
  }, [valor, duracao]);

  return <>{formato(atual)}</>;
}
