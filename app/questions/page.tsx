'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { saveResult } from '@/lib/supabase'
import { questionFlow, getQuestionById, getResultByTitle } from '@/lib/questions'
import { ArrowLeft, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react'

export default function Questions() {
  const [stage, setStage] = useState<'nickname' | 'questions' | 'result'>('nickname')
  const [nickname, setNickname] = useState('')
  const [currentQuestionId, setCurrentQuestionId] = useState(questionFlow.startQuestionId)
  const [result, setResult] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([])

  useEffect(() => {
    // パーティクルアニメーション
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }))
    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.vy + window.innerHeight) % window.innerHeight
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // 進捗計算のヘルパー関数
  const calculateProgress = () => {
    if (stage !== 'questions') return 0
    
    // 質問の深度を計算
    const questionDepth: { [key: string]: number } = {
      'q0': 0,
      'q1': 1,
      'q1a': 2,
      'q1b': 2,
      'q2': 1,
      'q2a': 2,
      'q2b': 2,
      'q3': 1,
      'q3a': 2,
      'q3b': 2
    }
    
    const maxDepth = 2
    const currentDepth = questionDepth[currentQuestionId] || 0
    return Math.round((currentDepth / maxDepth) * 100)
  }

  const progress = calculateProgress()

  // 管理画面に更新を通知する関数
  const notifyAdminUpdate = () => {
    // カスタムイベントを発行
    window.dispatchEvent(new CustomEvent('surveyCompleted'))
    
    // localStorage を使用して管理画面に通知
    localStorage.setItem('adminShouldRefresh', Date.now().toString())
  }

  const handleStartQuestions = () => {
    if (nickname.trim()) {
      setStage('questions')
    }
  }

  const handleAnswerSelect = async (optionId: string, optionText: string) => {
    const currentQuestion = getQuestionById(currentQuestionId)
    if (!currentQuestion) return

    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId)
    if (!selectedOption) return

    if (selectedOption.resultTitle) {
      // 結果に到達
      setResult(selectedOption.resultTitle)
      setStage('result')
      
      // 結果をデータベースに保存
      setIsSubmitting(true)
      try {
                 await saveResult(nickname, selectedOption.resultTitle)
        // 管理画面に更新を通知
        notifyAdminUpdate()
      } catch (error) {
        console.error('結果の保存に失敗しました:', error)
      } finally {
        setIsSubmitting(false)
      }
    } else if (selectedOption.nextQuestionId) {
      // 次の質問に進む
      setCurrentQuestionId(selectedOption.nextQuestionId)
    }
  }

  const handleRestart = () => {
    setStage('nickname')
    setNickname('')
    setCurrentQuestionId(questionFlow.startQuestionId)
    setResult(null)
    setIsSubmitting(false)
  }

  const currentQuestion = getQuestionById(currentQuestionId)
  const resultInfo = result ? getResultByTitle(result) : null

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 進捗バー */}
      {stage === 'questions' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-gray-900 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="px-4 py-2 text-center">
            <span className="text-xs text-gray-600">
              進捗: {progress}%
            </span>
          </div>
        </div>
      )}

      {/* パーティクル背景 */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-20"
            style={{
              left: particle.x,
              top: particle.y,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {stage === 'nickname' && (
          <div className="max-w-md mx-auto">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-2xl">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-600"></div>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  社会診断テスト
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  あなたのニックネームを入力してください
                </p>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="ニックネームを入力..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-900 text-sm sm:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleStartQuestions()}
                />
                
                <button
                  onClick={handleStartQuestions}
                  disabled={!nickname.trim()}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  開始する
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'questions' && currentQuestion && (
          <div className="max-w-2xl mx-auto mt-16">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-2xl">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-600"></div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mb-2">
                  {nickname}さんの診断
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2 sm:px-0">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id, option.text)}
                    className="w-full p-3 sm:p-4 text-left border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium group-hover:text-gray-700 text-sm sm:text-base leading-tight pr-2">
                        {option.text}
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={handleRestart}
                  className="text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  最初からやり直す
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'result' && resultInfo && (
          <div className="max-w-2xl mx-auto">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-2xl">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mb-2">
                  {nickname}さんの診断結果
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2 sm:px-0">
                  {resultInfo.title}
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {resultInfo.description}
                </p>
              </div>

              {isSubmitting && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-4 text-sm sm:text-base">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  結果を保存中...
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  もう一度診断する
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 