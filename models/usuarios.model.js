import {Schema, model} from "mongoose";
const userSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
export const usuarioModel = model('usuario', userSchema);