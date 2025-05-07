import { useCallback } from 'react';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 15;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - (PAGE_MARGIN_MM * 2);

const MM_TO_PX = 3.78;

interface SectionInfo {
  element: HTMLElement;
  height: number;
  offset: number;
}

export const useFitContent = () => {
  const checkFitOnePage = useCallback((contentElement: HTMLElement | null): boolean => {
    if (!contentElement) return true;

    const contentHeightPx = contentElement.scrollHeight;

    const a4ContentHeightPx = CONTENT_HEIGHT_MM * MM_TO_PX;

    return contentHeightPx <= a4ContentHeightPx;
  }, []);

  const findOptimalPageBreaks = useCallback((contentElement: HTMLElement | null): HTMLElement[] => {
    const breakPoints: HTMLElement[] = [];

    if (!contentElement) return breakPoints;

    const a4ContentHeightPx = CONTENT_HEIGHT_MM * MM_TO_PX;

    const sections = Array.from(contentElement.querySelectorAll('[data-section]'));

    const sectionInfos: SectionInfo[] = sections.map((section) => {
      const element = section as HTMLElement;
      return {
        element,
        height: element.offsetHeight,
        offset: element.offsetTop
      };
    });

    const experienceSection = sections.find(
      section => section.getAttribute('data-section') === 'experience'
    ) as HTMLElement | undefined;

    if (experienceSection) {
      const experienceChunks = Array.from(
        experienceSection.querySelectorAll('.experience-chunk')
      ) as HTMLElement[];

      if (experienceChunks.length > 1) {
        for (let i = 1; i < experienceChunks.length; i++) {
          breakPoints.push(experienceChunks[i]);
        }

        return breakPoints;
      }
    }

    let currentPageHeight = 0;

    for (let i = 0; i < sectionInfos.length; i++) {
      const section = sectionInfos[i];

      if (section.element === experienceSection && breakPoints.length > 0) {
        continue;
      }

      if (currentPageHeight + section.height > a4ContentHeightPx && i > 0) {
        breakPoints.push(section.element);
        currentPageHeight = section.height;
      } else {
        currentPageHeight += section.height;
      }
    }

    return breakPoints;
  }, []);

  return {
    checkFitOnePage,
    findOptimalPageBreaks,
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    PAGE_MARGIN_MM,
    CONTENT_HEIGHT_MM
  };
};

export default useFitContent;
