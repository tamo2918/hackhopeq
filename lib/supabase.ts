import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tseeelyrtzgidbjpcnmg.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZWVlbHlydHpnaWRianBjbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDM2NDMsImV4cCI6MjA2NzI3OTY0M30.eS3u4peTze-_c67mX3wfJFMNyEIW6LowHgmh6TD5qZg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 結果の型定義
export interface Result {
  id: string
  nickname: string
  result_title: string
  submitted_at: string
}

// 結果の保存
export async function saveResult(nickname: string, resultTitle: string) {
  const { data, error } = await supabase
    .from('results')
    .insert([
      {
        nickname,
        result_title: resultTitle,
        submitted_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) {
    console.error('Error saving result:', error)
    throw error
  }

  return data
}

// 結果の取得
export async function getResults() {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Error fetching results:', error)
    throw error
  }

  return data as Result[]
}

// 結果の集計
export async function getResultsCount() {
  const { data, error } = await supabase
    .from('results')
    .select('result_title')

  if (error) {
    console.error('Error fetching results count:', error)
    throw error
  }

  // 結果を集計
  const counts: Record<string, number> = {}
  data.forEach(item => {
    counts[item.result_title] = (counts[item.result_title] || 0) + 1
  })

  return Object.entries(counts).map(([title, count]) => ({
    title,
    count
  }))
} 