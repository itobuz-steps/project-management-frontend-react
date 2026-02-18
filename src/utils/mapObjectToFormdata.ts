export function mapObjectToFormData(obj: Record<string, unknown>): FormData {
  const formData = new FormData();
  for (const key in obj) {
    if (obj[key] instanceof Array) {
      if (obj[key].every((item) => item instanceof File)) {
        obj[key].forEach((item) => formData.append(key, item));
        continue;
      }

      obj[key].forEach((item) => formData.append(key + '[]', item));
      continue;
    }
    if (obj[key]) {
      formData.append(key, obj[key] as string | File);
    }
  }
  return formData;
}
