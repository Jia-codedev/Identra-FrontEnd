"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <motion.h1 
          className="text-6xl font-bold text-primary mb-4"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          404
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-semibold text-foreground mb-2"
        >
          Page Not Found
        </motion.h2>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-lg text-muted-foreground mb-8 max-w-md"
      >
        Oops! The page you&apos;re looking for seems to have wandered off into the digital void.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          href="/" 
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
            ←
          </motion.span>
          <span className="mx-2">Go to Homepage</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🏠
          </motion.span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 200 }}
        className="mt-12"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
          }}
          className="text-6xl opacity-20"
        >
          🔍
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;