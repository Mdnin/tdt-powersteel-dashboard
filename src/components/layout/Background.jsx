import { memo, useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import '../../styles/background.css';

function Background() {
  const [particlesReady, setParticlesReady] = useState(false);

  const supportsHover = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches,
    []
  );

  const particleOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      detectRetina: false,
      fpsLimit: 20,
      particles: {
        number: { value: 8, density: { enable: true, area: 1400 } },
        color: { value: '#ff7a00' },
        opacity: { value: 0.045, animation: { enable: false } },
        size: { value: { min: 1, max: 2 } },
        move: {
          enable: true,
          speed: 0.14,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
          resize: true
        },
        modes: {}
      },
      background: { color: 'transparent' }
    }),
    []
  );

  useEffect(() => {
    let mounted = true;

    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => {
      if (mounted) setParticlesReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="app-background">
      <div className="background-texture" />
      <div className="background-grid" />
      {particlesReady && supportsHover && <Particles className="background-particles" options={particleOptions} />}
      <div className="background-glow" />
      <div className="background-sweep" />
    </div>
  );
}

export default memo(Background);
