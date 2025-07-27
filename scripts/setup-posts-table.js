const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupPostsTable() {
  console.log('Creating posts table...');
  
  try {
    // Create posts table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create posts table for Phase 3
        CREATE TABLE IF NOT EXISTS posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          topic VARCHAR(100),
          difficulty VARCHAR(20) CHECK (difficulty IN ('초급', '중급', '고급')),
          location VARCHAR(200),
          instagram_url VARCHAR(500),
          image_urls TEXT[],
          like_count INTEGER DEFAULT 0,
          comment_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
        CREATE INDEX IF NOT EXISTS idx_posts_topic ON posts(topic);
        CREATE INDEX IF NOT EXISTS idx_posts_difficulty ON posts(difficulty);
        CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_posts_like_count ON posts(like_count DESC);

        -- Enable RLS
        ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (error) {
      console.error('Error creating table:', error);
    } else {
      console.log('Table created successfully');
    }
    
    // Create RLS policies
    const policies = [
      {
        name: 'Posts are viewable by everyone',
        sql: `CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);`
      },
      {
        name: 'Users can create their own posts',
        sql: `CREATE POLICY "Users can create their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);`
      },
      {
        name: 'Users can update their own posts', 
        sql: `CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);`
      },
      {
        name: 'Users can delete their own posts',
        sql: `CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);`
      }
    ];
    
    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', {
        sql: policy.sql
      });
      
      if (policyError) {
        console.log(`Policy "${policy.name}" might already exist:`, policyError.message);
      } else {
        console.log(`Policy "${policy.name}" created successfully`);
      }
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupPostsTable();