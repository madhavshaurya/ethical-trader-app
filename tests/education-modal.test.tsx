import { describe, expect, it, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import EducationModal from '@/components/home/EducationModal';
import * as educationStoreModule from '@/lib/educationStore';

describe('EducationModal accessibility & markup', () => {
  it('renders nothing when activeLessonId is null', () => {
    vi.spyOn(educationStoreModule, 'useEducationStore').mockReturnValue({
      activeLessonId: null,
      setActiveLessonId: vi.fn(),
    });
    const html = renderToStaticMarkup(<EducationModal />);
    expect(html).toBe('');
  });

  it('renders accessible dialog structure when activeLessonId is set', () => {
    vi.spyOn(educationStoreModule, 'useEducationStore').mockReturnValue({
      activeLessonId: 'basics',
      setActiveLessonId: vi.fn(),
    });
    const html = renderToStaticMarkup(<EducationModal />);

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby="education-modal-title"');
    expect(html).toContain('id="education-modal-title"');
    expect(html).toContain('aria-label="Close lesson modal"');
  });
});
