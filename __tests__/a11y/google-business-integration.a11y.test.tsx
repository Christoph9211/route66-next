import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import GoogleBusinessIntegration from '../../components/GoogleBusinessIntegration';

describe('Accessibility: GoogleBusinessIntegration', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<GoogleBusinessIntegration />);

    // Sanity check
    expect(container).toBeTruthy();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
