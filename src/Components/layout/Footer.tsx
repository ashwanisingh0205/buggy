import { Zap } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
         <footer className="relative z-10 border-t border-gray-800/50 px-6 py-16">
        <div className="max-w-7xl mx-auto text-gray-300 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Bloocube</span>
            </div>
            <p className="text-gray-400">Your social media workspace powered by AI.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Use Cases</a></li>
              <li><a href="#" className="hover:text-white">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Docs</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 text-center text-gray-500">
          <p>&copy; 2025 Bloocube. All rights reserved.</p>
        </div>
      </footer>
  )
}

export default Footer


