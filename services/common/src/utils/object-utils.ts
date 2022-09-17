export const clearObjectOwnProperties = (object: any) => {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      delete object[property];
    }
  }
};
