/**
 * Field values shared by projects, tasks and subtasks. Kept in one place so the
 * schemas and the DTO validators can't drift apart.
 */

export const PRIORITIES = ['none', 'urgent', 'high', 'medium', 'low'] as const;
export type Priority = (typeof PRIORITIES)[number];

/** Board columns. */
export const TASK_STATUSES = ['todo', 'doing', 'completed', 'onhold'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
