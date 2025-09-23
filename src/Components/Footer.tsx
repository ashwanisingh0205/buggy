import { Zap } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
         <footer className="relative z-10 border-t border-gray-800/50 px-6 py-12">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Bloocube</span>
          </div>
          <p>&copy; 2025 SocialAI. All rights reserved. Empowering social media excellence.</p>
        </div>
      </footer>
  )
}

export default Footer