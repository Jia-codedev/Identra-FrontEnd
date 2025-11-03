import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { AnimatePresence, motion } from "framer-motion";

function Popup({
  children,
  header,
  description,
}: {
  children: React.ReactNode;
  header: string;
  description?: string;
}) {
  return (
    <>
      <AnimatePresence mode="wait">
        {children && header && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className=""
            >
              <Card>
                <CardHeader>{header}</CardHeader>
                <CardContent>{children}</CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Popup;
