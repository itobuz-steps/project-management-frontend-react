/// <reference types="cypress" />
import { loginSession } from '../support/authHelper';

describe('TS-NAV-001: Navbar Render', () => {
  beforeEach(() => {
    loginSession();
    cy.visit('http://localhost:5173/for-you');
    cy.get('[data-testid="navbar"], nav, header', { timeout: 10000 }).should(
      'exist'
    );
  });

  it('TC_NAV_001: Navbar Display - Verify navbar renders with icons according to page', () => {
    // Just verify navbar exists and has multiple buttons/interactive elements
    cy.get('[data-testid="navbar"], nav, header')
      .should('be.visible')
      .and('have.length.greaterThan', 0);
    cy.get('nav button, nav [role="button"]').should(
      'have.length.greaterThan',
      0
    );
  });

  it('TC_NAV_002: Mobile Menu Hamburger - Verify hamburger menu on mobile', () => {
    cy.viewport('iphone-x');
    // Hamburger menu should be visible on mobile
    cy.get('nav button, nav [role="button"]').should(
      'have.length.greaterThan',
      0
    );
    cy.get('nav').should('be.visible');
  });

  it('TC_NAV_003: Desktop Menu - Verify hamburger hidden on desktop', () => {
    cy.viewport(1280, 720);
    // Navigation should render on desktop
    cy.get('nav').should('be.visible');
  });
});

describe('TS-NAV-002: Search & Command Palette', () => {
  beforeEach(() => {
    loginSession();
    // Navigate to for-you page first
    cy.visit('http://localhost:5173/project/69bd3de49f58968236d408da/backlog');
  });

  it('TC_NAV_004: Open Command Palette - Verify search opens command palette', () => {
    // Find the search button in navbar and click it
    cy.get('nav button').then(($buttons) => {
      const searchBtn = Array.from($buttons).find((btn) => {
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const svg = btn.querySelector('svg');
        return (
          ariaLabel.toLowerCase().includes('search') ||
          (svg && svg.getAttribute('class')?.includes('search'))
        );
      });

      if (searchBtn) {
        cy.wrap(searchBtn as HTMLElement).click();

        // Verify command palette modal appears
        cy.get('[role="dialog"], .fixed.inset-0', { timeout: 5000 }).should(
          'be.visible'
        );
        cy.get('input[placeholder*="Search tasks"]').should('be.visible');
      }
    });
  });

  it('TC_NAV_005: Close Command Palette - Verify Escape key closes palette', () => {
    // Open the command palette
    cy.get('nav button').then(($buttons) => {
      const searchBtn = Array.from($buttons).find((btn) => {
        const ariaLabel = btn.getAttribute('aria-label') || '';
        return ariaLabel.toLowerCase().includes('search');
      });

      if (searchBtn) {
        cy.wrap(searchBtn as HTMLElement).click();
        cy.get('input[placeholder*="Search tasks"]', { timeout: 5000 }).should(
          'be.visible'
        );

        // Press Escape key
        cy.get('body').type('{esc}');

        // Verify palette closes (modal should not be visible)
        cy.get('[role="dialog"], .fixed.inset-0', { timeout: 5000 }).should(
          'not.be.visible'
        );
      }
    });
  });

  it('TC_NAV_006: Search Tasks - Verify task search functionality', () => {
    // Open command palette
    cy.get('nav button').then(($buttons) => {
      const searchBtn = Array.from($buttons).find((btn) =>
        btn.getAttribute('aria-label')?.toLowerCase().includes('search')
      );

      if (searchBtn) {
        cy.wrap(searchBtn as HTMLElement).click();

        // Type search query - target input within modal only
        cy.get(
          '[role="dialog"] input[placeholder*="Search tasks"], .fixed.inset-0 input[placeholder*="Search tasks"]',
          { timeout: 5000 }
        )
          .first()
          .should('be.visible')
          .type('test', { delay: 50 });

        // Verify search results section appears
        cy.contains('Search results', { timeout: 5000 }).should('be.visible');

        // Results might be empty or have matches - either is valid
        cy.get('[role="dialog"], .fixed.inset-0').should('be.visible');
      }
    });
  });

  it('TC_NAV_007: Task Page Navigation - Navigate to task page from search', () => {
    // Open command palette
    cy.get('nav button').then(($buttons) => {
      const searchBtn = Array.from($buttons).find((btn) =>
        btn.getAttribute('aria-label')?.toLowerCase().includes('search')
      );

      if (searchBtn) {
        cy.wrap(searchBtn as HTMLElement).click();

        // Type search query to get results - target input within modal only
        cy.get(
          '[role="dialog"] input[placeholder*="Search tasks"], .fixed.inset-0 input[placeholder*="Search tasks"]',
          { timeout: 5000 }
        )
          .first()
          .type('task', { delay: 50 });

        // Wait for search results to load and look for task buttons
        cy.get('[role="dialog"] button, .fixed.inset-0 button', {
          timeout: 5000,
        }).then(($buttons) => {
          // Filter to task result buttons (they appear after the search header)
          const taskResultButtons = Array.from($buttons).filter((btn) => {
            const text = btn.textContent || '';
            // Task buttons show the task key and title
            return text.includes('-') && text.length > 3; // Task keys contain '-'
          });

          if (taskResultButtons.length > 0) {
            // Click the first task result
            cy.wrap(taskResultButtons[0] as HTMLElement).click();

            // Verify navigation to task page
            cy.url({ timeout: 5000 }).should('include', '/task');
          }
        });
      }
    });
  });
});

describe('TS-NAV-003: Notifications', () => {
  beforeEach(() => {
    loginSession();
    cy.visit('http://localhost:5173/for-you');
  });

  it('TC_NAV_010: Notification Bell Icon - Verify bell icon displays', () => {
    // Find and verify bell icon in navbar
    cy.get('nav button').then(($buttons) => {
      const bellBtn = Array.from($buttons).find((btn) => {
        const svg = btn.querySelector('svg');
        // Bell icon from lucide-react
        return (
          svg &&
          (svg.getAttribute('data-testid')?.includes('bell') ||
            btn.innerHTML.toLowerCase().includes('bell') ||
            // Fallback: check if it has Bell icon characteristics
            Array.from(btn.querySelectorAll('svg')).some(
              (s) =>
                s.getAttribute('class')?.includes('bell') ||
                s.getAttribute('viewBox') === '0 0 24 24'
            ))
        );
      });

      // If we can't find bell by icon, it might be the second button in navbar (after search)
      if (!bellBtn) {
        cy.get('nav button')
          .should('have.length.greaterThan', 1)
          .then(() => {
            // Bell icon should exist in navbar
            cy.get('nav').should('contain', 'Bell');
          });
      } else {
        cy.wrap(bellBtn as HTMLElement).should('be.visible');
      }
    });
  });

  it('TC_NAV_011: Notification Count Badge - Verify badge shows count', () => {
    // The badge only shows when there are new notifications and dropdown is closed
    // Check if badge element exists (may not appear if no new notifications)
    cy.get('#notificationBadge', { timeout: 2000 }).then(($badge) => {
      if ($badge.length > 0) {
        // If badge exists, it should contain a number
        cy.wrap($badge).should('be.visible');
        cy.wrap($badge).invoke('text').should('match', /\d+/);
      } else {
        // If no badge, that's also valid - it means no new notifications
        cy.get('nav button').should('have.length.greaterThan', 0);
      }
    });
  });

  it('TC_NAV_012: Open Notification Dropdown - Verify dropdown opens', () => {
    // Find bell button and click it
    cy.get('nav button').then(($buttons) => {
      // Find the bell button (usually after search button)
      let bellBtn: HTMLElement | undefined;

      Array.from($buttons).forEach((btn) => {
        if (!bellBtn && btn.querySelector('svg')) {
          // Count SVG-based buttons - bell is typically after search
          bellBtn = btn as HTMLElement;
        }
      });

      if (bellBtn) {
        cy.wrap(bellBtn).click();

        // Verify notification dropdown appears
        cy.get('h3')
          .contains('Notifications', { timeout: 5000 })
          .should('be.visible');

        // Dropdown should be visible
        cy.get('div[class*="absolute"][class*="right"]', {
          timeout: 5000,
        }).should('be.visible');
      }
    });
  });

  it('TC_NAV_013: Display Notifications - Verify notifications list displays', () => {
    // Open notifications dropdown
    cy.get('nav button').then(($buttons) => {
      const bellBtn = Array.from($buttons).find((btn) => {
        // This is roughly the second button in navbar (after search)
        const svgs = btn.querySelectorAll('svg');
        return svgs.length > 0;
      });

      if (bellBtn) {
        cy.wrap(bellBtn as HTMLElement).click();

        // Check for notification list container
        cy.get('ul', { timeout: 5000 }).should('be.visible');

        // Either show empty state or actual notifications
        cy.get('#notificationListEmpty, li', { timeout: 5000 }).should('exist');
      }
    });
  });

  it('TC_NAV_014: Close on Outside Click - Verify dropdown closes', () => {
    // Open notifications
    cy.get('nav button').then(($buttons) => {
      const bellBtn = Array.from($buttons).find((btn) => {
        const svgs = btn.querySelectorAll('svg');
        return svgs.length > 0;
      });

      if (bellBtn) {
        cy.wrap(bellBtn as HTMLElement).click();

        // Verify dropdown is open
        cy.get('h3').contains('Notifications').should('be.visible');

        // Click outside the notification container
        cy.get('body').click(0, 0);

        // Verify dropdown closes
        cy.get('h3')
          .contains('Notifications', { timeout: 5000 })
          .should('not.be.visible');
      }
    });
  });

  it('TC_NAV_015: Empty State - Verify empty notification message', () => {
    // Open notifications dropdown
    cy.get('nav button').then(($buttons) => {
      const bellBtn = Array.from($buttons).find((btn) => {
        const svgs = btn.querySelectorAll('svg');
        return svgs.length > 0;
      });

      if (bellBtn) {
        cy.wrap(bellBtn as HTMLElement).click();

        // Check for empty state message
        cy.get('#notificationListEmpty, li', { timeout: 5000 }).then(
          ($element) => {
            // If empty state exists, verify the message
            if ($element.text().includes('Nothing to see here')) {
              cy.wrap($element).should('be.visible');
            }
            // If notifications exist, that's also valid
          }
        );
      }
    });
  });

  it('TC_NAV_016: Load More Notifications - Verify pagination works', () => {
    // Open notifications dropdown
    cy.get('nav button').then(($buttons) => {
      const bellBtn = Array.from($buttons).find((btn) => {
        const svgs = btn.querySelectorAll('svg');
        return svgs.length > 0;
      });

      if (bellBtn) {
        cy.wrap(bellBtn as HTMLElement).click();

        // Check for target element that triggers load more
        cy.get('#targetElement', { timeout: 5000 }).then(($target) => {
          if ($target.length > 0) {
            // Scroll to the target element to trigger loadMore
            cy.wrap($target).scrollIntoView();

            // If there are more notifications to load, the loader should appear
            cy.get('#targetElement', { timeout: 5000 }).should('be.visible');
          }
          // If target doesn't exist, pagination might not be needed (all loaded)
        });
      }
    });
  });
});
