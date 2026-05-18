import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MetricCard from './MetricCard';
import KPIHoverPopup from './KPIHoverPopup';

const POPUP_WIDTH = 292;
const POPUP_HEIGHT = 232;
const POPUP_GAP = 6;
const VIEWPORT_PADDING = 12;
const HOVER_CLOSE_DELAY = 120;

function InteractiveMetricCard({ metric, title, ...cardProps }) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupStyle, setPopupStyle] = useState(null);
  const cardRef = useRef(null);
  const closeTimerRef = useRef(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const updatePopupPosition = useCallback(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const openLeft = rect.right + POPUP_WIDTH + POPUP_GAP > window.innerWidth;
    const left = openLeft
      ? rect.left - POPUP_WIDTH - POPUP_GAP
      : rect.right + POPUP_GAP;
    const top = Math.max(
      VIEWPORT_PADDING,
      Math.min(rect.top, window.innerHeight - POPUP_HEIGHT - VIEWPORT_PADDING)
    );

    setPopupStyle({
      top: `${top}px`,
      left: `${Math.max(VIEWPORT_PADDING, left)}px`,
      width: `${POPUP_WIDTH}px`
    });
  }, []);

  const openPopup = useCallback(() => {
    clearCloseTimer();
    updatePopupPosition();
    setIsHovered(true);
  }, [clearCloseTimer, updatePopupPosition]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, HOVER_CLOSE_DELAY);
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!isHovered) return undefined;

    const handleReposition = () => updatePopupPosition();
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isHovered, updatePopupPosition]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  return (
    <div
      ref={cardRef}
      className="interactive-metric-card"
      onMouseEnter={openPopup}
      onMouseLeave={scheduleClose}
      onFocus={openPopup}
      onBlur={scheduleClose}
      tabIndex={0}
    >
      <MetricCard {...cardProps} title={title} interactive={isHovered} />

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isHovered && popupStyle && (
              <motion.div
                className="kpi-popup kpi-popup-portal"
                style={popupStyle}
                onMouseEnter={openPopup}
                onMouseLeave={scheduleClose}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <KPIHoverPopup metric={metric} title={title} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

export default memo(InteractiveMetricCard);
