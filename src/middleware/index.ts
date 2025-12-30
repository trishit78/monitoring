import type { NextFunction, Request, Response } from "express";
import requestCounter from "../metrics/requestCount.js";
import { activeRequestsGauge } from "../metrics/activeRequests.js";
import { httpRequestDurationMs } from "../metrics/histogram.js";

export const metricsMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const startTime =Date.now();
    activeRequestsGauge.inc()
    res.on('finish',()=>{
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Request took ${endTime - startTime} ms`);
        requestCounter.inc({
            method:req.method,
            values:req.route ? req.route.path:req.path,
            status_code:res.statusCode
        })
        httpRequestDurationMs.observe({
            method:req.method,
            route:req.route ? req.route.path:req.path,
            code:res.statusCode
        },duration)

        activeRequestsGauge.dec()
    })
    next()
}