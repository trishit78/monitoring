import express, { type Request, type Response } from 'express';

import dotenv from 'dotenv';
import client from 'prom-client'
import { metricsMiddleware } from './middleware/index.js';

dotenv.config();

const app= express();
const PORT = process.env.PORT || '3001';
app.use(express.json());
app.use(metricsMiddleware)


const register = new client.Registry();

client.collectDefaultMetrics({
    register:client.register
})

app.get('/data',(_req:Request,res:Response)=>{
    res.json({
        message:'data api hit'
    })
})


app.get('/metrics',async(_req:Request,res:Response)=>{
    res.setHeader('Content-Type',client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
})


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})