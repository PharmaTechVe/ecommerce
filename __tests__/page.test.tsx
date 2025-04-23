import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/(shop)/page';
import { describe, it, expect } from 'vitest';

describe('Home Page', () => {
  it('displays the main heading', () => {
    render(<Home />);
    const heading = screen.getByText('Pharmatech...');
    expect(heading).toBeTruthy(); // Check if the element exists
  });

});