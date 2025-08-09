import React from 'react';
import { motion } from 'framer-motion';

function Loader() {
    return (
        <div className="flex items-center justify-center h-24">
            <motion.div
                className="relative w-12 h-12"
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                }}
            >
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"></div>
            </motion.div>
        </div>
    );
}

export default Loader;
