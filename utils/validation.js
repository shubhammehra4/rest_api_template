const BaseJoi = require("joi"),
    sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error("string.escapeHTML", { value });

                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);

exports.validateRegister = (req, res, next) => {
    const userSchemaRegister = Joi.object({
        email: Joi.string().email().min(6).required(),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .escapeHTML()
            .required(),
        name: Joi.string().min(3).max(30).escapeHTML().required(),
        password: Joi.string().min(8).max(50).required(),
        bio: Joi.string().alphanum().max(150).escapeHTML(),
        location: Joi.string().escapeHTML(),
    });
    const { error } = userSchemaRegister.validate(req.body);
    if (error) {
        const message = error.details.map((e) => e.message).join(", ");
        console.log(message); //! Remove
        next({
            status: 400,
            message,
        });
    } else {
        next();
    }
};

exports.validateLogin = (req, res, next) => {
    const userSchemaLogin = Joi.object({
        email: Joi.string().email().min(6),
        username: Joi.string().alphanum().min(3).max(30),
        password: Joi.string().min(8).required(),
    });
    const { error } = userSchemaLogin.validate(req.body);
    if (error) {
        const message = error.details.map((e) => e.message.join(", "));
        next({
            status: 400,
            message,
        });
    } else {
        next();
    }
};
