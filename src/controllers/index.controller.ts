import {Controller, Get} from "@overnightjs/core";
import {Service} from "typedi";
import {Request, Response} from "express";

@Service()
@Controller("/")
export class IndexController {
    @Get("/")
    public index(req: Request, res: Response) {
        if(req.userId) {
            res.render("index");
        } else {
            res.redirect("/auth/login/customer");
        }

    }
}