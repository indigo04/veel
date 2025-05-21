export const STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE"
} as const;

export type STATUS = keyof typeof STATUS;
