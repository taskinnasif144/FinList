


export enum Priority {
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog",
  }
  
  export enum Status {
    ToDo = "ToDo",
    WorkInProgress = "WorkInProgress",
    UnderReview = "UnderReview",
    Completed = "Completed",
  }

export interface Project {
    reduce(arg0: (acc: Record<string, number>, project: Project) => Record<string, number>, arg1: {}): unknown;
    id:number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?:string;
    teamId: string
}



export interface User {
    id?: string;
    email: string;
    username: string;
    password: string;
}



export interface Task {
    id: string;
    title: string;
    description?:string;
    status?: string,
    priority?: Priority;
    tags?:string;
    startDate?:string;
    dueDate?:string;
    projectId: string;

}

export interface SearchResults {
    tasks?: Task[];
    projects?: Project[];
    users?: User[];
  }
  
  export interface Team {
    id: string;
    teamName: string;
    users:    User[];
    projects: Project[];
  }

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users? : User[]
}

export interface Auth {
  message: string,
  status: boolean
}