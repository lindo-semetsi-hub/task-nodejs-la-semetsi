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
 }