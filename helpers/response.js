export function success(resources, meta) {
  return { data: resources, meta };
}
export function update(msg) {
  return { messsage: msg };
}
export function deleteUser(msg) {
  return { message: msg };
}

export function error({ status, code }, fields, description = "missing") {
  return {
    err: {
      status,
      code,
      description,
      fields
    }
  };
}
export function userProfile(resources, stats) {
  return {
    user: resources,
    statistics: stats
  };
}
