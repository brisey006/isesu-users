export interface FormError {
    field: string,
    message: string
}

export interface ResponseError extends Error {
    status?: number;
}

export interface Image {
    original: string,
    thumbnail: string,
    cropped: string
}

export interface UserResult {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    image: Image,
    createdAt: Date,
    updatedAt: Date
}

export default {}