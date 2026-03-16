import * as Joi from 'joi';

export const editOrderSchema = Joi.object({
  name: Joi.string().min(2).max(50).allow(null, ''),
  surname: Joi.string().min(2).max(50).allow(null, ''),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow(null, ''),
  phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .allow(null, ''),
  age: Joi.number().integer().min(1).max(99).allow(null),
  sum: Joi.number().min(0).allow(null),
  alreadyPaid: Joi.number().min(0).max(Joi.ref('sum')).allow(null),
  status: Joi.string().allow(null, ''),
  group: Joi.any().allow(null),
  course: Joi.string().allow(null, ''),
  course_format: Joi.string().allow(null, ''),
  course_type: Joi.string().allow(null, ''),
  manager: Joi.number().optional(),
});
