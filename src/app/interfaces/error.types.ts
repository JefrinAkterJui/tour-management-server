export interface TErrorSource{
    path: string,
    message: string
}
export interface TGenericErrorResponse{
    StatusCodes: number,
    message: string,
    errorSource?: TErrorSource[]
}
