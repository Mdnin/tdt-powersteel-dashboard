import { motion } from 'framer-motion';
import '../../styles/animations.css';
import logo from '../../assets/logos/tdt_logo.png';

export default function LoadingScreen() {
  return (
    <motion.div
      className="loader-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-container">
        <motion.img
          src={logo}
          alt="TDT Powersteel Logo"
          className="loading-logo"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="loading-bar-bg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="loading-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.35,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.div>

        <motion.p
          className="loading-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Initializing...<span className="loading-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
        </motion.p>
      </div>
    </motion.div>
  );
}
