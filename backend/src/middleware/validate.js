const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.errors ? err.errors.map(e => e.message).join(', ') : 'Invalid input data',
        statusCode: 422
      }
    });
  }
};

module.exports = validate;
