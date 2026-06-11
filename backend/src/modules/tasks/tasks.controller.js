const prisma = require('../../config/prisma');

const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, priority, sort = 'createdAt', order = 'desc' } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order === 'asc' ? 'asc' : 'desc' }
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id
      }
    });

    res.status(201).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await prisma.task.findUnique({ where: { id } });
    
    if (!task) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found', statusCode: 404 } });
    }

    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not own this task', statusCode: 403 } });
    }

    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: { task: updatedTask } });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    
    if (!task) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found', statusCode: 404 } });
    }

    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not own this task', statusCode: 403 } });
    }

    await prisma.task.delete({ where: { id } });

    res.json({ success: true, data: { message: 'Task deleted successfully' } });
  } catch (err) {
    next(err);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, priority, sort = 'createdAt', order = 'desc' } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order === 'asc' ? 'asc' : 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks
};
