const { z } = require('zod');

const TaskStatus = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
const Priority = z.enum(["LOW", "MEDIUM", "HIGH"]);

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: Priority.optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional())
  })
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: TaskStatus.optional(),
    priority: Priority.optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional())
  })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
