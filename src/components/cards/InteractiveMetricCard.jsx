import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy, memo, useCallback, useRef, useState } from 'react';
import MetricCard from './MetricCard';

const KPIHoverPopup = lazy(() => import('./KPIHoverPopup'));

function InteractiveMetricCard({ metric, ...cardProps }) {
  const [isHovered, setIsHovered] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const cardRef = useRef(null);

  const updatePopupSide = useCallback(() => {
    if (!cardRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const popupWidth = 340;
    const offset = 20;
    const shouldOpenLeft = cardRect.right + popupWidth + offset > window.innerWidth;
    setOpenLeft(current => (current === shouldOpenLeft ? current : shouldOpenLeft));
  }, []);

  const handleMouseEnter = useCallback(() => {
    updatePopupSide();
    setIsHovered(true);
  }, [updatePopupSide]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className="interactive-metric-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
    >
      <MetricCard {...cardProps} interactive={isHovered} />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={`kpi-popup ${openLeft ? 'open-left' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.96, x: openLeft ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: openLeft ? 10 : -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Suspense fallback={<div className="kpi-popup-skeleton" />}>
              <KPIHoverPopup metric={metric} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(InteractiveMetricCard);
