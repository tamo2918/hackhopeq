'use client'

import { useState, useEffect } from 'react'
import { getResultsCount, getResults, deleteAllResults, subscribeToResults } from '@/lib/supabase'
import Link from 'next/link'

interface CountData {
  title: string
  count: number
}

interface Result {
  id: string
  nickname: string
  result_title: string
  submitted_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [countData, setCountData] = useState<CountData[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([])
  const [animatedCounts, setAnimatedCounts] = useState<{[key: string]: number}>({})

  useEffect(() => {
    // パーティクルの初期化
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    // カウントアップアニメーション
    if (countData.length > 0) {
      const newAnimatedCounts: {[key: string]: number} = {}
      countData.forEach(item => {
        newAnimatedCounts[item.title] = 0
      })
      setAnimatedCounts(newAnimatedCounts)

      const animationDuration = 1500
      const frameRate = 60
      const totalFrames = (animationDuration / 1000) * frameRate
      
      let currentFrame = 0
      const timer = setInterval(() => {
        if (currentFrame >= totalFrames) {
          clearInterval(timer)
          return
        }
        
        const progress = currentFrame / totalFrames
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        
        const updatedCounts: {[key: string]: number} = {}
        countData.forEach(item => {
          updatedCounts[item.title] = Math.round(item.count * easeOutQuart)
        })
        
        setAnimatedCounts(updatedCounts)
        currentFrame++
      }, 1000 / frameRate)

      return () => clearInterval(timer)
    }
  }, [countData])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'hackhope') {
      setIsAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('パスワードが正しくありません')
    }
  }

  const handleReset = async () => {
    if (window.confirm('本当に全ての結果をリセットしますか？この操作は取り消せません。')) {
      setIsResetting(true)
      try {
        await deleteAllResults()
        
        await fetchData()
        alert('結果がリセットされました')
      } catch (err) {
        console.error('Reset error:', err)
        setError('リセットに失敗しました')
      } finally {
        setIsResetting(false)
      }
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const [counts, allResults] = await Promise.all([
        getResultsCount(),
        getResults()
      ])
      
      setCountData(counts)
      setResults(allResults)
      setTotalCount(allResults.length)
    } catch (err) {
      setError('データの取得に失敗しました。')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      // 初期データの取得
      fetchData()

      // Supabaseリアルタイム更新の設定
      const channel = subscribeToResults(() => {
        console.log('Realtime update triggered - fetching new data')
        fetchData()
      })

      return () => {
        // サブスクリプションをクリーンアップ
        if (channel) {
          channel.unsubscribe()
        }
      }
    }
  }, [isAuthenticated])

  // パスワード認証画面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
        {/* パーティクルアニメーション */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gray-300 animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${3 + particle.delay}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="relative max-w-md w-full mx-auto">
            <div className="border-2 border-gray-200 rounded-3xl bg-white shadow-xl">
              <div className="relative p-8 sm:p-12 text-center">

                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4">管理画面</h1>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  管理画面にアクセスするにはパスワードが必要です
                </p>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="パスワードを入力"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-black text-black placeholder-gray-500 text-base sm:text-lg font-medium transition-all duration-300"
                      required
                    />
                  </div>
                  
                  {authError && (
                    <div className="border border-red-300 bg-red-50 rounded-2xl p-3 sm:p-4">
                      <p className="text-red-700 text-sm sm:text-base">{authError}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="group relative w-full"
                  >
                    <div className="relative px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform group-hover:scale-105 shadow-xl">
                      ログイン
                      <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                </form>
                
                <div className="mt-6 sm:mt-8">
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-black transition-colors text-sm sm:text-base"
                  >
                    ← ホームに戻る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gray-300 animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${3 + particle.delay}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-black text-lg sm:text-xl font-medium">データを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gray-300 animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${3 + particle.delay}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="relative max-w-lg mx-auto p-4">
            <div className="border-2 border-red-300 bg-red-50 rounded-3xl shadow-xl">
              <div className="relative p-6 sm:p-8 text-center">

                <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-4">エラーが発生しました</h2>
                <p className="text-red-600 mb-6 text-sm sm:text-base">{error}</p>
                <button
                  onClick={fetchData}
                  className="group relative"
                >
                  <div className="relative px-6 py-3 bg-black text-white rounded-2xl font-bold transition-all duration-300 transform group-hover:scale-105">
                    再試行
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* パーティクルアニメーション */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gray-300 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black">
                  管理ダッシュボード
                </h1>
                <div className="w-32 sm:w-48 h-1 bg-black rounded-full"></div>
              </div>
              <Link
                href="/"
                className="group relative mt-4 lg:mt-0"
              >
                <div className="relative px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-2xl font-semibold transition-all duration-300 transform group-hover:scale-105 text-sm sm:text-base">
                  ホームに戻る
                </div>
              </Link>
            </div>

            {/* 統計サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="group relative">
                <div className="border-2 border-gray-200 rounded-3xl bg-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="relative p-6 sm:p-8 text-center">

                    <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                      {totalCount}
                    </div>
                    <div className="text-gray-600 font-medium text-sm sm:text-base">総回答数</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="border-2 border-gray-200 rounded-3xl bg-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="relative p-6 sm:p-8 text-center">

                    <div className="text-3xl sm:text-4xl font-bold text-black mb-2">
                      {countData.length}
                    </div>
                    <div className="text-gray-600 font-medium text-sm sm:text-base">社会タイプ</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="border-2 border-gray-200 rounded-3xl bg-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="relative p-6 sm:p-8 text-center">

                    <div className="text-xl sm:text-2xl font-bold text-black mb-2">
                      リアルタイム
                    </div>
                    <div className="text-gray-600 font-medium text-sm sm:text-base">更新方式</div>
                  </div>
                </div>
              </div>
            </div>

            {/* リセットボタン */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="group relative"
              >
                <div className="relative px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-2xl font-semibold transition-all duration-300 transform group-hover:scale-105 disabled:opacity-50 text-sm sm:text-base">
                  {isResetting ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      削除中...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      全結果をリセット
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="relative">
              <div className="border-2 border-gray-200 rounded-3xl bg-white shadow-xl">
                <div className="relative p-12 sm:p-20 text-center">

                  <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">まだ回答がありません</h2>
                  <p className="text-gray-600 text-base sm:text-lg">診断が完了すると、ここに結果が表示されます</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-12">
              {/* 回答一覧 */}
              <div className="relative">
                <div className="border-2 border-gray-200 rounded-3xl bg-white shadow-xl">
                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-center mb-4 sm:mb-6">

                      <h2 className="text-xl sm:text-2xl font-bold text-black">
                        回答一覧（ニックネーム別）
                      </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-black font-semibold text-sm sm:text-base">ニックネーム</th>
                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-black font-semibold text-sm sm:text-base">診断結果</th>
                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-black font-semibold text-sm sm:text-base">回答日時</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result, index) => (
                            <tr 
                              key={result.id} 
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              <td className="py-3 sm:py-4 px-3 sm:px-6">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mr-2 sm:mr-3">
                                    {result.nickname.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-black font-medium text-sm sm:text-base">{result.nickname}</span>
                                </div>
                              </td>
                              <td className="py-3 sm:py-4 px-3 sm:px-6">
                                <span className="inline-block px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-black text-xs sm:text-sm font-medium border border-gray-300">
                                  {result.result_title}
                                </span>
                              </td>
                              <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm">
                                {new Date(result.submitted_at).toLocaleDateString('ja-JP', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* 社会タイプ別集計 */}
              <div className="relative">
                <div className="border-2 border-gray-200 rounded-3xl bg-white shadow-xl">
                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-center mb-4 sm:mb-6">

                      <h2 className="text-xl sm:text-2xl font-bold text-black">
                        社会タイプ別集計
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {countData.map((item, index) => (
                        <div 
                          key={index} 
                          className="group relative"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="border border-gray-200 rounded-2xl bg-gray-50 group-hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                            <div className="relative p-4 sm:p-6 text-center">
                              <div className="text-2xl sm:text-3xl font-bold text-black mb-2">
                                {animatedCounts[item.title] || 0}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 px-2">
                                {item.title}
                              </div>
                              <div className="text-xs text-gray-500 font-medium mb-2 sm:mb-3">
                                {totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0}%
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2">
                                <div 
                                  className="bg-black h-1 sm:h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${totalCount > 0 ? (item.count / totalCount) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 