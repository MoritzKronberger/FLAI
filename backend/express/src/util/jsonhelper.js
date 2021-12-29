const jsonHelper = (query) => {
  return JSON.parse(query['data'])
}

export { jsonHelper }
export default { jsonHelper }
