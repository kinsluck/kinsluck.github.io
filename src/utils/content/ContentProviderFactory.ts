import type { ContentAdapter, ContentProvider } from './types';
import { MarkdownContentAdapter } from './adapters/MarkdownContentAdapter';
import { SanityContentAdapter } from './adapters/SanityContentAdapter';

export function getContentProvider(): ContentProvider {
  const provider = import.meta.env.PUBLIC_CONTENT_PROVIDER?.toLowerCase() || 'markdown';
  
  if (provider !== 'markdown' && provider !== 'sanity') {
    console.warn(
      `Invalid content provider "${provider}". Falling back to "markdown".`
    );
    return 'markdown';
  }

  return provider as ContentProvider;
}

export function createContentAdapter(): ContentAdapter {
  const provider = getContentProvider();

  switch (provider) {
    case 'sanity':
      try {
        return new SanityContentAdapter();
      } catch (error) {
        console.error('Failed to initialize Sanity adapter:', error);
        console.warn('Falling back to Markdown adapter.');
        return new MarkdownContentAdapter();
      }

    case 'markdown':
    default:
      return new MarkdownContentAdapter();
  }
}

let contentAdapterInstance: ContentAdapter | null = null;

export function getContentAdapter(): ContentAdapter {
  if (!contentAdapterInstance) {
    contentAdapterInstance = createContentAdapter();
  }
  return contentAdapterInstance;
}
