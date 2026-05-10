import { Todo } from '../models/todo.model.js';

export async function createTodo(req, res, next) {
	try {
		const todo = await Todo.create(req.body);

		res.status(201).json(todo);
	} catch (error) {
		next(error);
	}
}

export async function listTodos(req, res, next) {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;

		const filter = {};

		if (req.query.completed !== undefined) {
			filter.completed = req.query.completed === 'true';
		}

		if (req.query.priority) {
			filter.priority = req.query.priority;
		}

		if (req.query.search) {
			filter.title = {
				$regex: req.query.search,
				$options: 'i',
			};
		}

		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			Todo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
			Todo.countDocuments(filter),
		]);

		res.json({
			data,
			meta: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		next(error);
	}
}

export async function getTodo(req, res, next) {
	try {
		const todo = await Todo.findById(req.params.id);

		if (!todo) {
			return res.status(404).json({
				error: {
					message: 'Todo not found',
				},
			});
		}

		res.json(todo);
	} catch (error) {
		next(error);
	}
}

export async function updateTodo(req, res, next) {
	try {
		const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!todo) {
			return res.status(404).json({
				error: {
					message: 'Todo not found',
				},
			});
		}

		res.json(todo);
	} catch (error) {
		next(error);
	}
}

export async function toggleTodo(req, res, next) {
	try {
		const todo = await Todo.findById(req.params.id);

		if (!todo) {
			return res.status(404).json({
				error: {
					message: 'Todo not found',
				},
			});
		}

		todo.completed = !todo.completed;

		await todo.save();

		res.json(todo);
	} catch (error) {
		next(error);
	}
}

export async function deleteTodo(req, res, next) {
	try {
		const todo = await Todo.findByIdAndDelete(req.params.id);

		if (!todo) {
			return res.status(404).json({
				error: {
					message: 'Todo not found',
				},
			});
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
