'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([])

  useEffect(() => {
    // パーティクルの初期化
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

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

      {/* 管理画面ボタン */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <Link
          href="/admin"
          className="group relative px-4 py-2 sm:px-6 sm:py-3 bg-black text-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-sm sm:text-base"
        >
          <span className="relative font-semibold">管理画面</span>
        </Link>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダーセクション */}
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 text-black">
              社会のタイプ診断
            </h1>
            <div className="w-32 sm:w-48 h-1 bg-black mx-auto rounded-full mb-6 sm:mb-8"></div>
            <div className="relative">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto px-4">
                簡単な質問に答えて、あなたの考える社会のタイプを診断しましょう
              </p>
              <p className="text-base sm:text-lg text-gray-500 mt-4 max-w-3xl mx-auto px-4">
                回答は統計として活用され、社会の多様な価値観を可視化します
              </p>
            </div>
          </div>

          {/* 診断カード */}
          <div className="mb-16 sm:mb-20">
            <div className="group relative max-w-2xl mx-auto">
              <div className="relative border-2 border-gray-200 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative p-8 sm:p-12 text-center">
                  <div className="mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-black rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-white rounded-full"></div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
                      診断を受ける
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto px-4">
                      ニックネームを入力して、選択式の質問に答えることで、
                      あなたの考える社会のタイプを診断します
                    </p>
                  </div>
                  
                  <Link
                    href="/questions"
                    className="group/button relative inline-block"
                  >
                    <div className="relative px-8 sm:px-12 py-3 sm:py-4 bg-black text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-bold text-base sm:text-lg">
                      診断を開始
                      <span className="ml-2 inline-block group-hover/button:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 社会タイプ紹介 */}
          <div className="relative">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                8つの社会タイプ
              </h2>
              <p className="text-gray-600 text-base sm:text-lg px-4">
                質問に答えることで、以下のいずれかに分類されます
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: '多文化共生社会' },
                { title: '排除主義社会' },
                { title: '受け入れ懸念社会' },
                { title: '多文化意識社会' },
                { title: '収容懸念社会' },
                { title: '孤立社会' },
                { title: '人道的懸念社会' },
                { title: '対立型社会' },
              ].map((type, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="border border-gray-200 rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative p-4 sm:p-6 text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-black rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white rounded-full"></div>
                      </div>
                      <h3 className="text-black font-semibold text-xs sm:text-sm leading-tight px-2">
                        {type.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 説明セクション */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="relative max-w-4xl mx-auto">
              <div className="border border-gray-200 rounded-3xl bg-white shadow-xl">
                <div className="relative p-8 sm:p-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-6">
                    この診断について
                  </h2>
                  <div className="text-gray-600 text-left space-y-3 sm:space-y-4 leading-relaxed text-sm sm:text-base">
                    <p>
                      この診断は、難民・移民受け入れ問題に対する社会の様々な立場を分析し、
                      それぞれの立場が導く社会像を体系的に整理したものです。
                    </p>
                    <p>
                      診断結果は統計として活用され、社会の多様な価値観を可視化することで、
                      建設的な議論の基盤となることを目指しています。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
