// api/pages.api.ts
import { api } from "./axios";

export interface Page {
  id: string;
  title: string;
  color: string;
  pageId: string;
  ownerId: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    name: string;
    type: "CALENDAR" | "BOARD";
    config: any;
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
  shares?: Array<{
    id: string;
    permission: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  _count?: {
    events: number;
    tasks: number;
  };
}

export interface CreatePageDto {
  title: string;
  templateType: "CALENDAR" | "BOARD";
  color?: string;
}

export interface UpdatePageDto {
  title?: string;
  color?: string;
}

// دریافت تمام pages
export async function fetchPages(templateType?: string): Promise<Page[]> {
  const params = templateType ? { templateType } : {};
  const res = await api.get("/pages", { params });
  return res.data.data;
}

// دریافت یک page خاص
export async function fetchPageById(id: string): Promise<Page> {
  const res = await api.get(`/pages/${id}`);
  return res.data.data;
}

// ساخت page جدید
export async function createPage(data: CreatePageDto): Promise<Page> {
  const res = await api.post("/pages", data);
  return res.data.data;
}

// آپدیت page
export async function updatePage(id: string, data: UpdatePageDto): Promise<Page> {
  const res = await api.patch(`/pages/${id}`, data);
  return res.data.data;
}

// حذف page
export async function deletePage(id: string): Promise<void> {
  await api.delete(`/pages/${id}`);
}
