import { Request, Response } from "express";

class PatientController {
    async handle(req: Request, res: Response){
        return Response.json({ nome: "Douglas" });
    }
}

export { PatientController };