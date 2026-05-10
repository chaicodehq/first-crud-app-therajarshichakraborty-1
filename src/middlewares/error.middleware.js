export function errorHandler(err, req, res, next) {
	if (err.name === 'ValidationError') {
		const messages = Object.values(err.errors)
			.map((e) => e.message)
			.join(', ');

		return res.status(400).json({
			error: {
				message: messages,
			},
		});
	}

	if (err.name === 'CastError') {
		return res.status(400).json({
			error: {
				message: 'Invalid id format',
			},
		});
	}

	res.status(err.status || 500).json({
		error: {
			message: err.message || 'Internal Server Error',
		},
	});
}
