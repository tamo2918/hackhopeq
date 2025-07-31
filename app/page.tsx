'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'

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
              国育成ゲーム
            </h1>
            <div className="w-32 sm:w-48 h-1 bg-black mx-auto rounded-full mb-6 sm:mb-8"></div>
            <div className="relative">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto px-4">
                                  簡単な質問に答えて、あなたの理想とする国を育成しましょう
              </p>
            </div>
          </div>

          {/* 診断カード */}
          <div className="mb-16 sm:mb-20">
            <div className="group relative max-w-2xl mx-auto">
              <div className="relative border-2 border-gray-200 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative p-8 sm:p-12 text-center">
                  <div className="mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center">
                      <Image
                        src="/president.png"
                        alt="hackhope大統領"
                        width={96}
                        height={96}
                        className="w-full h-full"
                      />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
                      ゲームを開始する
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto px-4">
                      ニックネームを入力して、選択式の質問に答えることで、
                      あなたが育成する国家のタイプを決定します
                    </p>
                  </div>
                  
                  <Link
                    href="/questions"
                    className="group/button relative inline-block"
                  >
                    <div className="relative px-8 sm:px-12 py-3 sm:py-4 bg-black text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-bold text-base sm:text-lg">
                      ゲームを開始
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
                    8つの国家タイプ
                  </h2>
              <p className="text-gray-600 text-base sm:text-lg px-4">
                質問に答えることで、以下のいずれかに分類されます
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: '多文化共生社会', image: 'character1.png' },
                { title: '受け入れ困難社会', image: 'character2.png' },
                { title: '収容重視社会', image: 'character3.png' },
                { title: '人道的課題社会', image: 'character4.png' },
                { title: '排除主義社会', image: 'character5.png' },
                { title: '対立助長社会', image: 'character6.png' },
                { title: '孤立社会', image: 'character7.png' },
                { title: '経済発展社会', image: 'character8.png' },
              ].map((type, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="border border-gray-200 rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative p-4 sm:p-6 text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center">
                        <Image
                          src={`/${type.image}`}
                          alt={type.title}
                          width={64}
                          height={64}
                          className="w-full h-full"
                        />
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
                    このゲームについて
                  </h2>
                  <div className="text-gray-600 text-left space-y-3 sm:space-y-4 leading-relaxed text-sm sm:text-base">
                    <p>
                      この国育成ゲームは、難民・移民受け入れ問題に対する様々な政策選択を分析し、
                      それぞれの選択が導く国家像を体系的に整理したものです。
                    </p>
                    <p>
                      ゲーム結果は統計として活用され、多様な政策選択を可視化することで、
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
