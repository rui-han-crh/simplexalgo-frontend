export function getPageName(path: string): string {
  switch (path) {
    case '/two-phase':
      return 'Two Phase Simplex';
    case '/big-m':
      return 'Big-M Method';
    default:
      return 'No Such Page';
  }
};