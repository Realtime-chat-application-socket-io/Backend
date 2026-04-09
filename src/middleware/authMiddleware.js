import joi from "joi";
import {StatusCodes} from "http-status-pro-js";

function usermidsignup(req,res,next) {
    try {
        let {name,email,password} = req.body;
        let schema = joi.object({
            name:joi.string().trim().lowercase().min(3).max(200).required(),
            email:joi.string().trim().lowercase().email().min(8).max(200).required(),
            password:joi.string().trim().min(4).max(10).required()
        })
        let{error,value} = schema.validate(req.body)
        if(error) {
            res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:error.message,
                data:null
            })
            return;
        }
        req.body = value;
        next();


    } catch (error) {
        resizeBy.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data: null
        })
    }
}

export function usermidlogin(req,res,next) {
    try {
        let {name,email,password} = req.body;
        let schema = joi.object({
            email:joi.string().trim().lowercase().email().min(8).max(200).required(),
            password:joi.string().trim().min(4).max(10).required()
        })
        let{error,value} = schema.validate(req.body)
        if(error) {
            res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:error.message,
                data:null
            })
            return;
        }
        req.body = value;
        next();


    } catch (error) {
        resizeBy.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,  
            data: null
        })
    }
}

export function usermidupdate(req,res,next) {
    try {
        let {name,email,password} = req.body;
        let schema = joi.object({
            name:joi.string().trim().lowercase().min(3).max(200).required(),
            email:joi.string().trim().lowercase().email().min(8).max(200).required(),
            id:joi.number()
        })
        let{error,value} = schema.validate(req.body)
        if(error) {
            res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:error.message,
                data:null
            })
            return;
        }
        req.body = value;
        next();


    } catch (error) {
        resizeBy.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data: null
        })
    }
}