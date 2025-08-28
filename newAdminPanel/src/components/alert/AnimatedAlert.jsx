import { Alert } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { helperFunctions } from 'src/_helpers';

// ----------------------------------------------------------------------

const AnimatedAlert = ({ messageObj, onClose, sx, ...other }) => {
  return messageObj?.message ? (
    <AnimatePresence>
      <motion.div
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 0,
        }}
        animate={{
          x: 0,
          scale: 1,
          opacity: 1,
          borderRadius: 0,
        }}
        whileInView="visible"
        viewport={{ once: true }}
        exit={{ opacity: 0, scale: 0.8 }}
        layoutId={messageObj?.message}
      >
        <Alert
          severity={helperFunctions.alertseverity(messageObj?.type)}
          sx={{ m: 2, ...sx }}
          onClose={onClose}
          {...other}
        >
          {messageObj?.message}
        </Alert>
      </motion.div>
    </AnimatePresence>
  ) : null;
};

export default AnimatedAlert;
