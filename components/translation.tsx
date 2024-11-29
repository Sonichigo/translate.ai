'use client'

import React, { useState } from 'react'
import { Languages, Loader2, RefreshCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

// Language mappings
const LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ru': 'Russian',
  'ar': 'Arabic'
}

export default function TranslationComponent() {
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError('Please enter text to translate')
      return
    }

    setIsLoading(true)
    setError('')
    setTranslation('')

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang
        })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      setTranslation(data.translatedText)
    } catch (err) {
      setError('Failed to translate. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const swapLanguages = () => {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setText(translation)
    setTranslation('')
  }

  return (
    <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-2xl">
      <div className="flex items-center justify-center mb-6">
        <Languages className="w-10 h-10 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Translator</h1>
      </div>

      <div className="flex space-x-4 mb-4">
        {/* Source Language Select */}
        <div className="flex-1">
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source Language">
                {LANGUAGES[sourceLang as keyof typeof LANGUAGES]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <SelectItem key={code} value={code}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Languages Button */}
        <Button 
          onClick={swapLanguages}
          className="hover:bg-blue-50 transition"
        >
          <RefreshCcw className="w-5 h-5 text-blue-600" />
        </Button>

        {/* Target Language Select */}
        <div className="flex-1">
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Target Language">
                {LANGUAGES[targetLang as keyof typeof LANGUAGES]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <SelectItem key={code} value={code}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Source Text Input */}
        <Textarea 
          placeholder="Enter text to translate" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] resize-none"
        />

        {/* Translated Text Output */}
        <div className="bg-gray-50 rounded-md p-3 min-h-[200px] flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : translation ? (
            <p className="text-gray-800">{translation}</p>
          ) : (
            <p className="text-gray-400">Translation will appear here</p>
          )}
        </div>
      </div>

      <Button 
        onClick={handleTranslate} 
        disabled={isLoading || !text}
        className="w-full bg-blue-600 hover:bg-blue-700 transition"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </Button>
    </div>
  )
}