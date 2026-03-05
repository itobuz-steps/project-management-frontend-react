export function mapObjectToFormData(obj: Record<string, unknown>): FormData {
  const formData = new FormData();
  for (const key in obj) {
    if (obj[key] instanceof Array) {
      if (obj[key].length && obj[key].every((item) => item instanceof File)) {
        obj[key].forEach((item) => formData.append(key, item));
        continue;
      }

      console.log('Array field', {
        key,
        value: obj[key],
        length: obj[key].length,
      });

      if (obj[key].length) {
        obj[key].forEach((item) => formData.append(key + '[]', item));
      } else {
        formData.append(key, '[]');
      }

      continue;
    }

    if (obj[key] !== undefined) {
      if (obj[key] === null) {
        formData.append(key, 'null');
      } else {
        formData.append(key, obj[key] as string | File);
      }
    }
  }
  return formData;
}
