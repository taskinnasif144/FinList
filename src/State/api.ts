import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react"
import { Auth, auth, Project, ProjectTasks, SearchResults, Task, Team, User } from "./types"
import { url } from "inspector";
import { method } from "lodash";
import { Provider } from "react-redux";




export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL}),
    tagTypes: ["Projects", "Tasks", "Users", "Teams", "Users"],
    endpoints: (builder) => ({
        userSignUp: builder.mutation<Auth,User>({
            query: ({ email, password, username })=> ({
                url: 'users/create',
                method: "POST",
                body:{email, password, username}
            }),
            invalidatesTags: ["Projects"]
        }),
        userLogin: builder.mutation<Auth, Partial<User>>({
            query: ({email, password})=>({
                url: 'users/login',
                method: "POST",
                body:{email, password}
            })
        }),
        getProjects: builder.query<Project[], void>({
            query: () => "projects",
            providesTags: ["Projects"],
        }),
        createProject: builder.mutation<Project, Partial<Project>>({
            query: (project) => ({
                url: "projects/create",
                method: "POST",
                body: project
            }),
            invalidatesTags: ["Projects"]
        }),
        deleteProject: builder.mutation<Project, {projectId:string}>({
            query: ({projectId})=> ({
                url: `projects/delete/${projectId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Projects"]
        }),
        getAllTasks: builder.query<Task[], void>({
            query: () => `tasks`,
            providesTags: (result) => result? result.map(({id})=> ({type: "Tasks" , id})): [],
        }),
        getTasks: builder.query<Task[], {projectId: string}>({
            query: ({projectId}) => `tasks/${projectId}`,
            providesTags: (result) => result? result.map(({id})=> ({type: "Tasks" , id})): [],
        }),
        createTask: builder.mutation<Task, Partial<Task>>({
            query: (task) => ({
                url: "tasks/create",
                method: "POST",
                body: task
            }),
            invalidatesTags: ["Tasks"]
        }),
        updateTask: builder.mutation<Task, {taskId: string; status:string}> ({
            query: ({taskId, status}) => ({
                url: `tasks/${taskId}/status`,
                method: "PATCH",
                body: {status}
            }),
            invalidatesTags:(result, error, {taskId}) => [{type: "Tasks", id: taskId}]
        }),
        assignTaskToProject: builder.mutation<{suc:boolean}, {projectId: string, taskId: string}>({
            query: ({taskId, projectId}) => ({
                url: "tasks/assign-task-project",
                method: "PATCH",
                body: {taskId, projectId}
            }),
            invalidatesTags:["Tasks"]
        }),
        removeTaskFromProject: builder.mutation<{suc:boolean}, {taskId: string}>({
            query: ({ taskId}) => ({
                url: "tasks/remove-task-project",
                method: "PATCH",
                body: { taskId}
            }),
            invalidatesTags:["Tasks"]
        }),
        editTask: builder.mutation<Task, Partial<Task>> ({
            query: (task) => ({
                url: `tasks/${task.id}/status`,
                method: "PATCH",
                body: task
            }),
            invalidatesTags:(result, error, {id}) => [{type: "Tasks", id: id}]
        }),
        deleteTask: builder.mutation<Task, {taskId: string}>({
            query: ({taskId}) => ({
                url: `tasks/delete/${taskId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Tasks"]
        }),
        getUsers: builder.query<User[], void>({
            query: ()=> "users",
            providesTags: ["Users"]
        }),
       getUserById: builder.query<User, {id:String}> ({
        query: ({id}) => `users/${id}`,
        providesTags: ["Users"]
       }),

        getTeams: builder.query<Team[], void>({
            query: ()=> "teams",
            providesTags: ["Teams"]
        }),
        createTeam: builder.mutation<Team, {teamName:string}>({
            query: (teamName) =>( {
                url: `teams/create`,
                method: "POST",
                body: teamName

            }),
            invalidatesTags: ["Teams"]
        }),
        deleteTeam: builder.mutation<Team, {teamId: string}>({
            query: ({teamId}) => ({
                url: `teams/delete/${teamId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Teams"]
        }),
        assignUserToTeam: builder.mutation<{suc:boolean}, {userId: string, teamId: string}>({
            query: ({teamId, userId}) => ({
                url: "users/assign-team-user",
                method: "PATCH",
                body: {teamId, userId}
            }),
            invalidatesTags:["Users"]
        }),
        removeUserFromTeam: builder.mutation<{suc:boolean}, {userId: string}>({
            query: ({ userId}) => ({
                url: "users/remove-team-user",
                method: "PATCH",
                body: { userId}
            }),
            invalidatesTags:["Users"]
        }),
        assignProjectToTeam: builder.mutation<{suc:boolean}, {projectId: string, teamId: string}>({
            query: ({teamId, projectId}) => ({
                url: "projects/assign-team-project",
                method: "PATCH",
                body: {teamId, projectId}
            }),
            invalidatesTags:["Projects"]
        }),
        removeProjectFromTeam: builder.mutation<{suc:boolean}, {projectId: string}>({
            query: ({ projectId}) => ({
                url: "projects/remove-team-project",
                method: "PATCH",
                body: { projectId}
            }),
            invalidatesTags:["Projects"]
        }),
        getProjectsTasks:builder.query<ProjectTasks[], void>({
            query: ()=> "projects/tasks",
            providesTags: ["Projects"],

        }),
        search: builder.query<SearchResults, string>({
            query:(query) => `search?query=${query}`
        })
    })
});


export const {useGetProjectsQuery, useCreateProjectMutation, useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useSearchQuery, useGetUsersQuery, useGetTeamsQuery, useGetProjectsTasksQuery, useDeleteProjectMutation, useDeleteTaskMutation, useCreateTeamMutation, useDeleteTeamMutation,useGetUserByIdQuery, useAssignUserToTeamMutation, useRemoveUserFromTeamMutation, useAssignProjectToTeamMutation,useRemoveProjectFromTeamMutation, useGetAllTasksQuery,useAssignTaskToProjectMutation, useRemoveTaskFromProjectMutation, useUserSignUpMutation, useUserLoginMutation } = api;