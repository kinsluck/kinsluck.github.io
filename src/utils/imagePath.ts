export function resolveImagePath(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return '';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  if (imagePath.startsWith('../../content/')) {
    return imagePath.replace('../../content/', '/content/');
  }

  if (imagePath.startsWith('../')) {
    return `/${imagePath.replace('../', '')}`;
  }

  return `/content/${imagePath}`;
}

export function isValidImagePath(imagePath: string | undefined | null): boolean {
  if (!imagePath) {
    return false;
  }
  return imagePath.trim().length > 0;
}
