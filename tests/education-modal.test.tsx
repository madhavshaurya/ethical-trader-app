import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import EducationModal from '@/components/home/EducationModal';

vi.mock('@/lib/educationStore', () => ({
  useEducationStore: vi.fn(),
}));

import { useEducationStore } from '@/lib/educationStore';

describe('EducationModal accessibility', () => {
  it('renders with dialog role, aria-labelledby, and close button aria-label when active', () => {
    vi.mocked(useEducationStore).mockReturnValue({
      activeLessonId: 'basics',
      setActiveLessonId: vi.fn(),
    });

    const html = renderToStaticMarkup(<EducationModal />);

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby="lesson-modal-title"');
    expect(html).toContain('id="lesson-modal-title"');
    expect(html).toContain('aria-label="Close lesson modal"');
  });

  it('renders nothing when activeLessonId is null', () => {
    vi.mocked(useEducationStore).mockReturnValue({
      activeLessonId: null,
      setActiveLessonId: vi.fn(),
    });
    const html = renderToStaticMarkup(<EducationModal />);
    expect(html).toBe('');
  });
});
