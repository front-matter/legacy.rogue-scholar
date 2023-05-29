import NextNProgress from 'nextjs-progressbar';

import { customTheme } from '@/chakra-ui.config';

export default function ProgressBar() {
  return <NextNProgress height={4} color={customTheme.colors.primary.DEFAULT} showOnShallow={true} />;
}
