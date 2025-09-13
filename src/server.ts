import http, {IncomingMessage, ServerResponse } from "http";
import { items } from "./data/items";
import { Item } from "./models/item";
import { sendError, sendSuccess, sendJSON } from "./utils/response";
import { validateNewItemPaylooad, validateUpdatePaylooad } from "./utils/validation";
import { randomUUID } from "crypto";
import { it } from "node:test";


//json body parser for node http server

function parseRequestBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => {
            chunks.push(chunk as Buffer);
        });
    req.on("end", () => {
        if (chunks.length === 0) return resolve(undefined);
        const raw = Buffer.concat(chunks).toString("utf-8").trim();
        if (!raw) return resolve(undefined);
        try {
            const parsed = JSON.parse(raw);
            resolve(parsed);
        } catch (err) {
            reject(new Error("Invalid JSON in request body"));
        }
    });
    req.on("error", (err) => reject(err));
    });

}

// router helper
function matchPath(pathname: string, pattern: string) {

    const pParts = pattern.split("/").filter(Boolean);
    const tParts = pattern.split("/").filter(Boolean);

    if (pParts.length !== tParts.length) return null;

    const params: Record<string, string> = {};

for (let i=0; i< pParts.length; i++) {
    const p = pParts[i];
    const t= tParts[i];
if (p.startsWith(":")) {
    params[p.slice(1)] = decodeURIComponent(t);
} else if (p !== t) {
    return null;
}
}
return params;
}

//routes

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS ") {
    res.writeHead(204);
    return res.end();
}

try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    // get/items

    if (req.method === "GET"  &&  matchPath(pathname, "/items")) {
        return sendSuccess(res, 200, { items });
    }

    //post/items
    if ( req.method === "POST" && matchPath(pathname, "/items")) {
        const body = await parseRequestBody(req).catch((e) => {
            sendError(res, 400, "INVALID_JSON", "Request body contains invalid JSON.");
            throw e; 
        });

        const errors = validateNewItemPaylooad(body);
        if (errors.length) {
            return sendError(res, 400, "VALIDATION_ERROR", errors.join(" "));
        }

        const newItem: Item = {
            id: randomUUID(),
            name: String(body.name).trim(),
            quantity: String(body.quantity),
            purchased: Boolean(body.purchased),
            createdAt: new Date().toISOString()
        };

        items.push(newItem);
        return sendSuccess(res, 201, { item: newItem });

     }
      // get id

        const getMatch = matchPath(pathname, "/items/:id");
        if(req.method === "GET" && getMatch) {
            const id = getMatch!.id;
            const found = items.find((it) => it.id === id);
            if (!found) return sendError(res, 404, "NOT_FOUND", `Item with id '${id}' not found.`);
        return sendSuccess(res, 200, {item: found });
        }

    //put
    if (req.method === "PUT" && getMatch) {
        const id = getMatch!.id;
        const foundIndex = items.findIndex((it) => it.id === id);
        if (foundIndex === -1) return sendError(res, 404, "NOT_FOUND", `Item with id '${id}' not found.`);

        const body = await parseRequestBody(req).catch((e) => {
            sendError(res, 400, "INVALID_JSON", "Request body contains invalid JSON.");
            throw e;
        });

        const errors = validateUpdatePaylooad(body);
        if (errors.length) {
            return sendError(res, 400, "VALIDATION_ERROR", errors.join(" "));
        }

        const existing = items[foundIndex];
        const updated: Item = {
            ...existing,
            name: body.name !== undefined ? String(body.name).trim() : existing.name,
            quantity: body.quantity !== undefined ? String(body.quantity) : existing.quantity,
            purchased: body.purchased !== undefined ? Boolean(body.purchased) : existing.purchased,
            updatedAt: new Date().toISOString()
        };
        items[foundIndex] = updated;
        return sendSuccess(res, 200, { item: updated});
    }

    // delete 

    if (req.method === "DELETE" && getMatch) {
        const id = getMatch!.id;
        const idx = items.findIndex((it) => it.id ===id);
        if (idx === -1) return sendError(res, 404, "NOT_FOUND", `Item with id '${id}' not found`);
        items.splice(idx, 1);
// no content to send back
        res.writeHead(204);
        return res.end();
    }

    // no route matched?
    return sendError(res, 404, "ENDPOINT_NOT_FOUND", `No endpoint found for ${req.method} ${pathname}`);
} catch (err) {

   // error for last resort
   console.error("Server error:", err);
   if (!res.headersSent) {
    sendError(res, 500, "INTERNAL_ERROR", "Something went wrong on the server.");
   }
}
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => {
    console.log(`Shopping List API running at http://localhost:${PORT}`);
});