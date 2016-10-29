const validate = require('webpack-validator');
const Joi = require('webpack-validator').Joi;

// This joi schema will be `Joi.concat`-ed with the internal schema
const schemaExtension = Joi.object({
  sassResources: Joi.any() // this would just allow the property and doesn't perform any additional validation
});

module.exports = function(config) {
  validate(config, { schemaExtension: schemaExtension });
}
