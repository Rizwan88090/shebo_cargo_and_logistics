"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MdHome, MdArrowBack } from "react-icons/md";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFoundWrapper}>
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className={styles.errorNum}
        >
          404
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.title}
        >
          Lost in Transit?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={styles.subtitle}
        >
          The page you are looking for has either been relocated, had its route changed, or was not shipped in the first place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={styles.actions}
        >
          <Link href="/" className="btn btn-primary">
            <MdHome /> Return Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <MdArrowBack /> Go Back
          </button>
        </motion.div>
      </div>

      {/* Decorative cargo background patterns */}
      <div className={styles.shapes}>
        <div className={styles.shape1} />
        <div className={styles.shape2} />
      </div>
    </div>
  );
}
