export function validateNewItemPaylooad(payload: any) {
    const errors: string[] = [];
    if (!payload || typeof payload !== "object" ) {
        errors.push("Request body must be a JSON object.");

        return errors;
    }
    if (!payload.name || typeof payload.name !== "string" || !payload.name.trim()) {
        errors.push("Field 'name is required and must not be empty");
    }
     if (!payload.quantity || (typeof payload.quantity !== "string" && typeof payload.quantity !== "number")) {
        errors.push("Field 'quantity' is required and should be a combination of letters and/or numbers. E.g. 6L, 20"); // restructure 
     }
     if (!payload.purchased !== undefined && typeof payload.purchased !== "boolean") {
        errors.push("Field 'purchased', if available, should be either 'true' or 'false'"); // restructure 
     }

     return errors;
 }

 export function validateUpdatePaylooad(payload: any) {
    const allowed = ["name", "quantity", "purchased"];
    if (!payload || typeof payload !== "object") {
        return ["Request body must be a JSON object."];
    }

    const keys = Object.keys(payload);
    if (keys.length === 0) {
        return ["At least one updatable field (name, quantity, purchased) must be provided."];
    }
    const extra = keys.filter((k) => !allowed.includes(k));
    if (extra.length) {
        return [`Unkown fields: ${extra.join(", ")}. Only name, quantity, purchased are allowed.`];
    }
    const errors: string[] = [];
    if (payload.name !== undefined && (typeof payload.name !== "string" || !payload.name.trim())) {
        errors.push("If provided, 'name' must not be empty")
    }
    if (payload.quantity !== undefined && typeof payload.quantity !== "string" && typeof !payload.quantity !== "number") {
        errors.push("If provided, 'quantity' must be a string or numbers")
 }
 if (payload.purchsed !== undefined && typeof payload.purchased !== "boolean") {
    errors.push("If provided, 'purchased' must be a boolean");
}
return errors;
 }