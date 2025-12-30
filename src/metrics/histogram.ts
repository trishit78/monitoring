import client from 'prom-client';

export const httpRequestDurationMs = new client.Histogram({
    name:'http_request_duration_ms',
    help:'Duration of HTTP request in ms',
    labelNames:['method','route','code'],
    buckets:[0.1,5,15,50,100,300,500,1000,3000,5000]
}) 
