const prisma = require('../../config/prisma');

const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);

    res.json({
      success: true,
      data: {
        users,
        total,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Cannot demote self', statusCode: 400 } });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User does not exist', statusCode: 404 } });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true }
    });

    res.json({ success: true, data: { user: updatedUser } });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Cannot delete self', statusCode: 400 } });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User does not exist', statusCode: 404 } });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ success: true, data: { message: 'User deleted successfully' } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser
};
