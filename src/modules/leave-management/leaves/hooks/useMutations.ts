"use client";

// Approval mutations are intentionally removed from the leaves page.
// This stub keeps imports working if referenced elsewhere.

export const useLeaveMutations = () => ({
  approve: { mutate: () => {}, mutateAsync: async () => {} } as any,
  reject: { mutate: () => {}, mutateAsync: async () => {} } as any,
  remove: { mutate: () => {}, mutateAsync: async () => {} } as any,
});

export default useLeaveMutations;
