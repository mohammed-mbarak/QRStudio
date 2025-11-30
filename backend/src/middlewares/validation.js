import Joi from 'joi';

export const validateQRGeneration = (req, res, next) => {
  const schema = Joi.object({
    data: Joi.string().min(1).max(4000).required(),
    type: Joi.string().valid('url', 'text', 'email', 'phone', 'wifi', 'vcard').default('text'),
    size: Joi.number().min(100).max(1000).default(300),
    margin: Joi.number().min(0).max(10).default(1),
    colorDark: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#000000'),
    colorLight: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#FFFFFF')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};