export interface ICreateProjectPayload {
  name: string;
  description?: string;
}

export interface IUpdateProjectPayload {
  name?: string;
  description?: string;
  status?: string;
}