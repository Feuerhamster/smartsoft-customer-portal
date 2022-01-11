import {Controller, Get} from "@overnightjs/core";
import {Service} from "typedi";
import {Request, Response} from "express";
import {DesignMode} from "../models/design";
import {URL} from "url";

@Service()
@Controller("design")
export class DesignController {
    @Get("dark")
    public switchToDarkmode(req: Request, res: Response) {
        res.cookie("design", DesignMode.Dark);
        res.redirect((new URL(req.headers.referer)).pathname);
    }

    @Get("light")
    public switchToLightmode(req: Request, res: Response) {
        res.cookie("design", DesignMode.Light);
        res.redirect((new URL(req.headers.referer)).pathname);
    }
}