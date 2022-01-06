export function errorMessage(message?: string) {
  if (!message) message = 'Sorry, there was an error.'
  alert(message)
}
