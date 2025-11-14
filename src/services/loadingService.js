// Simple loading service with reference counting and subscription
let count = 0
let listeners = new Set()

export function show() {
  count += 1
  notify()
}

export function hide() {
  count = Math.max(0, count - 1)
  notify()
}

export function isLoading() {
  return count > 0
}

export function subscribe(cb) {
  listeners.add(cb)
  // call immediately with current state
  cb(isLoading())
  return () => listeners.delete(cb)
}

function notify() {
  const state = isLoading()
  for (const cb of listeners) cb(state)
}
