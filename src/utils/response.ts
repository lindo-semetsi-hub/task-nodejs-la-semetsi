import { IncomingMessage, ServerResponse } from "http";

export function sendJSON (
    res: ServerResponse,
    statusCode: number,
    payload: unknown
) {
    const body = JSON.stringify(payload);
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body).toString()
    });
    res.end(body);
}

export function sendError(
    res: ServerResponse,
    statusCode: number,
    code: string,
    message: string
) {
    sendJSON(res, statusCode, {
        status: "error",
        error: {
            code, 
            message
        }
    });
}

export function sendSuccess (
    res: ServerResponse,
    statusCode: number,
    data: unknown
) {
    sendJSON(res, statusCode, {
        status: "success",
        data
    })
}