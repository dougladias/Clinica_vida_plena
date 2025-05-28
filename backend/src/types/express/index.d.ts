
// Este arquivo estende a interface Request do Express para incluir uma propriedade user_id
declare namespace Express {
    export interface Request {
        user_id: string; 
    }
}