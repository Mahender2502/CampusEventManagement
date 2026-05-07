export function ok(res, { status = 200, message = 'OK', data = null } = {}) {
  return res.status(status).json({ success: true, message, data })
}

export function fail(res, { status = 400, message = 'Bad Request', errors = null } = {}) {
  return res.status(status).json({ success: false, message, errors })
}
