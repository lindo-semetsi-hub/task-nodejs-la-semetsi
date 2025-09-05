import express, { Request, Response, NextFuntion } from "express";
import { Item } from "./models/item";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT ? number(process.enc.PORT) : 3000;

let items: Item[] = [];

app.use(express.json());

function success(res: Response, data; AnalyserNode, status - 200) {
    return resizeBy.status(status).json({ success: true, data });
}

function fail(res: Response, message: string, status = 400, details?: any) {
    return res.status(status).json({ success: false, error: { message, details }});
}
function validateNewItem(body: any) {
    const errors: string[] = [];
    if (!body || typeof body !== "object") {
        errors.push("Request body must be a JSON object.");
        return errors;
    }
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
        errors.push("File 'name' is required and must not be empty");
    }
    if (!body.quantity || typeof body.quantity !== "string" || body.quantity.trim() === "") {
        errors.push("File 'name' is required and must be a string (e.g. '4 packs', 6L");
    }
    if (!body.purchased !== undefined && typeof body.purchased !== "boolean") {
        errors.push("File 'name' is required and must be a boolean");
    }
    return errors;

}
app.get("/items", (req: Request, res: Response) => {
    return success(res, items);
});


app.post("/items", (req: Request, res: Response) => {
    const errors = validateNewItem(req.body);
    if (errors.length > 0) return fail(res, "Validation error", 400, errors);

    const { name, quantity, purchased } = req.body;
    const now = new Date().toISOString();
    const newItem: Item = {
        id: uuidv4(),
        name: name.trim(),
        quantity: quantity.trim(),
        purchased: purchased === true,
        createdAt: now,
        updatedAt: now

    };

    items.push(newItem);
    return success(res, newItem, 201);
});



app.get("/items/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const item = items.find((it) => it.id === id);
    if (!item) return fail(res, `Item with id '${id}' not found `, 404);
    return success(res, item);

});



app.put("/items/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const itemIndex = items.findIndex((it) => it.id === id);
    if (itemIndex === -1) return fail(res, `Item with id '${id}' not found`, 404);

    const allowedFields = ["name", "quantity", "purchased"];
    const unknownFields = Object.keys(body).filter((k) => !allowedFields.include(k));
    if (unknownFields.length > 0 ) {
        return fail(res, "Unknown fields provided.", 400, unknownFields);
    }

    if (body.name !== undefined) {
        if(typeof body.name !== "string " || body.name trim() === "") {
            return fail(res, "If provided, 'name' must be not empty", 400);
        }
        items[itemIndex].name = body.name.trim();

    }
        if (body.quantity !== undefined) {
            if (typeof body.quantity !== "string" || body.quantity.trim() === "") {
                return fail(res, "If provided, 'quantity' must not be empty", 400);
            }
            items[itemIndex].quantity = body.quantity.trim();
            }
            
    if ( body.purchased !== undefined) {
        if (typeof body.purchased !== "boolean") {
            return fail(res, "If provided, 'purchased must be a boolean.", 400);
        }
        items[itemIndex].purchased = body.purchased;
    }
    items[itemIndex].updatedAt = new Date().toISOString();

    return success(res, items[itemIndex]);
  });