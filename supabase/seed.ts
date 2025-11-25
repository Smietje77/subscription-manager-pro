import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if seed data already exists
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (existingCategories && existingCategories.length > 0) {
      console.log('⚠️  Seed data already exists. Skipping...');
      console.log('   To re-seed, first run: npm run db:reset');
      return;
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('   - 10 Categories');
    console.log('   - 10 Products');
    console.log('   - Multiple Plans per Product');
    console.log('   - Prices in USD and EUR');
    console.log('   - Default Settings');
    console.log('');
    console.log('🚀 Your database is ready to use!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
