import { NoteColor } from "@/app/lib/types";
import { api } from "../../api";

// Matches backend's utils/response.ts sendSuccess() envelope.
type ApiEnvelope<T> = { success: true; data: T };

// Matches backend's templates.types.ts TemplateResponseDto.
export type Template = {
    id: string;
    title: string;
    body: string;
    color: NoteColor;
    createdAt: number;
    updatedAt: number;
};

type CreateTemplateRequest = {
    title: string;
    body: string;
    color: NoteColor;
};

type UpdateTemplateRequest = {
    id: string;
    title?: string;
    body?: string;
    color?: NoteColor;
};

export const templateApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTemplates: builder.query<Template[], void>({
            query: () => ({ url: "/templates", method: "GET" }),
            transformResponse: (response: ApiEnvelope<Template[]>) =>
                response.data,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Template" as const,
                              id,
                          })),
                          { type: "Template" as const, id: "LIST" },
                      ]
                    : [{ type: "Template" as const, id: "LIST" }],
        }),
        getTemplate: builder.query<Template, string>({
            query: (id) => ({ url: `/templates/${id}`, method: "GET" }),
            transformResponse: (response: ApiEnvelope<Template>) =>
                response.data,
            providesTags: (_result, _error, id) => [{ type: "Template", id }],
        }),
        createTemplate: builder.mutation<Template, CreateTemplateRequest>({
            query: (body) => ({ url: "/templates", method: "POST", body }),
            transformResponse: (response: ApiEnvelope<Template>) =>
                response.data,
            invalidatesTags: [{ type: "Template", id: "LIST" }],
        }),
        updateTemplate: builder.mutation<Template, UpdateTemplateRequest>({
            query: ({ id, ...body }) => ({
                url: `/templates/${id}`,
                method: "PUT",
                body,
            }),
            transformResponse: (response: ApiEnvelope<Template>) =>
                response.data,
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Template", id },
            ],
        }),
        deleteTemplate: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/templates/${id}`, method: "DELETE" }),
            transformResponse: (response: ApiEnvelope<{ message: string }>) =>
                response.data,
            invalidatesTags: (_result, _error, id) => [
                { type: "Template", id },
            ],
        }),
    }),
});

export const {
    useGetTemplatesQuery,
    useGetTemplateQuery,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
} = templateApi;
