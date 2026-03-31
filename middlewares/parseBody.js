import { z } from "zod";

export function validateRequest(schema) {
    return (req, res, next) => {
        try {
            const result = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query
            });

            if (!result.success) {
                return res.status(400).json({
                    message: "Validation Failed",
                    errors: z.treeifyError(result.error),
                });
            }

            res.locals.validated = result.data
            next();
        } catch (error) {
            next(error);
        }
    }
}