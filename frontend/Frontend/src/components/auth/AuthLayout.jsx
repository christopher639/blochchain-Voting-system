import React from 'react'

export default function AuthLayout({ title, children, aside }){
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white border-r border-gray-100 p-10">
        <div className="max-w-md">
          <div className="mb-6">
            <img src="/assets/images/University_of_Ghana_(UG)_logo.jpg" alt="University of Ghana" className="h-24 w-auto mb-4 object-contain shrink-0" onError={(e)=>{e.target.style.display='none'}} />
            <div className="text-3xl font-bold text-gray-900">University of Ghana</div>
            <div className="text-sm text-gray-600 mt-1">Student Representative Council Election</div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">University of Ghana Electronic Voting System</h2>
          <p className="mt-3 text-sm text-gray-600">Secure, transparent and convenient electronic voting.</p>
          <div className="mt-6 text-sm text-gray-500">Your vote is recorded and verifiable by the election system while protecting your privacy.</div>
          {aside}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
