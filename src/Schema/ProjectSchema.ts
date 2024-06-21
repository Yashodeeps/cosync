import { z } from "zod";

const Workspace = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

const User = z.object({
  id: z.number().int().positive(),
});

export const ProjectSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().optional(),
  userId: z.number().int(),
  owner: z.number().int(),
  teamMembers: z.array(User).default([]).optional(),
  workspaces: z.array(Workspace).default([]).optional(),
});
