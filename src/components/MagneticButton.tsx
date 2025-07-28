import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const MagneticButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    setMousePosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 2500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-8">
        <motion.button
          ref={buttonRef}
          className="relative overflow-hidden bg-white border-2 border-gray-900 px-8 py-4 rounded-full font-medium text-gray-900 cursor-pointer select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Magnetic light that follows cursor inside button */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                width: '80px',
                height: '80px',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.3) 30%, rgba(255, 215, 0, 0.1) 60%, transparent 100%)',
                borderRadius: '50%',
                filter: 'blur(1px)',
              }}
              animate={{
                x: mousePosition.x - 40,
                y: mousePosition.y - 40,
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          
          {/* Button content with icon animation */}
          <motion.div 
            className="flex items-center gap-2 relative z-10"
          >
            <AnimatePresence mode="wait">
              {!isClicked ? (
                <motion.div
                  key="default"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Click me</span>
                  <motion.div
                    animate={{ x: isHovered ? 3 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  className="flex items-center gap-2 text-green-600"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    delay: 0.1 
                  }}
                >
                  <motion.div
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 600, 
                      damping: 30,
                      delay: 0.2 
                    }}
                  >
                    <Check size={18} />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Success!
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Success ripple effect */}
          <AnimatePresence>
            {isClicked && (
              <motion.div
                className="absolute inset-0 border-2 border-green-500 rounded-full"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Confetti effect - positioned absolutely to screen to avoid layout displacement */}
      <AnimatePresence>
        {isClicked && buttonRef.current && (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const distance = 100 + Math.random() * 50;
              const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
              
              const rect = buttonRef.current!.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              
              return (
                <motion.div
                  key={i}
                  className="fixed w-2 h-2 rounded-sm pointer-events-none"
                  style={{
                    backgroundColor: colors[i % colors.length],
                    left: centerX,
                    top: centerY,
                    zIndex: 50,
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1, 
                    scale: 0,
                    rotate: 0 
                  }}
                  animate={{ 
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: [0, 1, 0.5, 0],
                    rotate: 360
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: "easeOut",
                    delay: 0.4 + (i * 0.02)
                  }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagneticButton;