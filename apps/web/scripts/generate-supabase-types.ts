import { execSync } from 'child_process';
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

(async () => {
  if (!supabaseUrl) {
    console.error('⚠️ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL');
    return;
  }

  const projectId = supabaseUrl.split('//')[1].split('.')[0];

  try {
    execSync(
      `supabase gen types typescript --project-id ${projectId} > types/supabase.ts && prettier --write types/supabase.ts`
    );
    console.error('✅ Types were generated and written to types/supabase.ts');
  } catch (e) {
    console.error(`⚠️ Could not load type from project id ${projectId}`, e);
  }
})();
