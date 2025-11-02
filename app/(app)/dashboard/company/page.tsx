"use client";

import { motion } from "framer-motion";
import CompanyProfileForm from "../CompanyProfileForm";

export default function CompanyPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Company Profile</h1>
        <p className="text-muted-foreground">
          Enter your brand details — this helps AI personalize your marketing content.
        </p>
      </motion.div>

      <CompanyProfileForm />
    </div>
  );
}
