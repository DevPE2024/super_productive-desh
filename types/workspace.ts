import { CustomColors } from "@prisma/client";

// Tipo Workspace baseado no schema Prisma
export interface Workspace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string | null;
  image: string | null;
  color: CustomColors;
  inviteCode: string;
  adminCode: string;
  canEditCode: string;
  readOnlyCode: string;
}

