/**
 * Basic JSON response for controller
 */
export type BasicResponse = {
   message: string
}

export type UserResponse = {
   name: string
};

export type ErrorResponse = {
   error: string
   message: string
}
