// hooks/usePages.ts
import {
  createPage,
  deletePage,
  fetchPageById,
  fetchPages,
  updatePage,
  type CreatePageDto,
  type UpdatePageDto,
} from "@/api/pages.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const pageKeys = {
  all: ["pages"] as const,
  lists: () => [...pageKeys.all, "list"] as const,
  list: (templateType?: string) => [...pageKeys.lists(), { templateType }] as const,
  details: () => [...pageKeys.all, "detail"] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
};

// دریافت لیست pages
export function usePages(templateType?: string) {
  return useQuery({
    queryKey: pageKeys.list(templateType),
    queryFn: () => fetchPages(templateType),
  });
}

// دریافت یک page خاص
export function usePage(id: string) {
  return useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: () => fetchPageById(id),
    enabled: !!id,
  });
}

// ساخت page جدید
export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePageDto) => createPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

// آپدیت page
export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePageDto }) => updatePage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(variables.id) });
    },
  });
}

// حذف page
export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}
