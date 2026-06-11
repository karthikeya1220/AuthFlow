const { z } = require('zod');

const Role = z.enum(["USER", "ADMIN"]);

const updateRoleSchema = z.object({
  body: z.object({
    role: Role
  })
});

module.exports = {
  updateRoleSchema
};
