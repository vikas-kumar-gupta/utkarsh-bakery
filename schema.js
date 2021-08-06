const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().trim().min(3).required().escapeHTML(),
        // imgLink: Joi.string().trim().min(3).required().escapeHTML(),
        salePrice: Joi.number().min(0).required(),
        price: Joi.number().min(0).required(),
        weight: Joi.number().min(0).required(),
        shape: Joi.string().trim().required().escapeHTML(),
        flavour: Joi.string().trim().min(3).required().escapeHTML(),
        category: Joi.array(),
        tier: Joi.string().trim().min(3).required().escapeHTML(),
        description: Joi.string().trim().min(3).required().escapeHTML(),
        availability: Joi.string().trim().min(3).required().escapeHTML()
    }),
    deleteImages: Joi.array()
})