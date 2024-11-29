'use client'

import React, { useState } from 'react'
import { Languages, Loader2, RefreshCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

// Define a type for language
type Language = {
  code: string;
  name: string;
}

// Expanded and categorized language mappings
const LANGUAGE_CATEGORIES = {
  popular: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' }
  ],
  other: [
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'tr', name: 'Turkish' },
    { code: 'hi', name: 'Hindi' },
    { code: 'sv', name: 'Swedish' }
  ]
}

// Convert to a flat object for easy lookup
const LANGUAGES = Object.fromEntries(
  [...LANGUAGE_CATEGORIES.popular, ...LANGUAGE_CATEGORIES.other]
    .map(lang => [lang.code, lang.name])
)

export default function TranslationComponent() {
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('')
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
    <div className="bg-white shadow-2xl rounded-xl p-7 w-full max-w-2xl">
      <div className="flex items-center justify-center mb-6">
        <Languages className="w-10 h-10 text-purple-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Translator</h1>
      </div>

      <div className="flex space-x-4 mb-4">
        {/* Source Language Select */}
        <div className="flex-1">
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source Language">
                {LANGUAGES[sourceLang]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div className="mb-2 px-2 text-sm font-semibold text-gray-600">Popular Languages</div>
              {LANGUAGE_CATEGORIES.popular.map(({ code, name }) => (
                <SelectItem key={code} value={code}>{name}</SelectItem>
              ))}
              <div className="border-t my-2"></div>
              <div className="mb-2 px-2 text-sm font-semibold text-gray-600">Other Languages</div>
              {LANGUAGE_CATEGORIES.other.map(({ code, name }) => (
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

        {/* Target Language Input */}
        <div className="flex-1">
          <Textarea 
            placeholder="Enter Language (e.g. Spanish)" 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="min-h-[25px] resize-none"
          />
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
        disabled={isLoading || !text || !targetLang}
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