import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import EducationModal from '@/components/home/EducationModal';
import { useEducationStore } from '@/lib/educationStore';
import { LESSONS } from '@/lib/education-content';

vi.mock('@/lib/educationStore', () => ({
  useEducationStore: vi.fn(),
}));

function decode(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

describe('EducationModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no lesson is active', () => {
    vi.mocked(useEducationStore).mockReturnValue({
      activeLessonId: null,
      setActiveLessonId: vi.fn(),
    });

    const html = renderToStaticMarkup(<EducationModal />);
    expect(html).toBe('');
  });

  it('renders accessible dialog structure and close button when a lesson is active', () => {
    vi.mocked(useEducationStore).mockReturnValue({
      activeLessonId: 'basics',
      setActiveLessonId: vi.fn(),
    });

    const rawHtml = renderToStaticMarkup(<EducationModal />);
    const html = decode(rawHtml);

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby="modal-lesson-title"');
    expect(html).toContain('id="modal-lesson-title"');
    expect(html).toContain('aria-label="Close lesson"');
    expect(html).toContain(LESSONS['basics'].title);
  });
});
