import React from 'react'

export default function AuthLayout({ title, children, aside }){
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white border-b lg:border-b-0 lg:border-r border-gray-100 p-4 sm:p-6 lg:p-10">
        <div className="max-w-md w-full">
          <div className="mb-6 text-center lg:text-left">
            <img src="/assets/images/University_of_Ghana_(UG)_logo.jpg" alt="University of Ghana" className="h-20 sm:h-24 w-auto mb-3 sm:mb-4 object-contain shrink-0 mx-auto lg:mx-0" onError={(e)=>{e.target.style.display='none'}} />
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">University of Ghana</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Student Representative Council Election</div>
          </div>
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">University of Ghana Electronic Voting System</h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">Secure, transparent and convenient electronic voting.</p>
          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">Your vote is recorded and verifiable by the election system while protecting your privacy.</div>
          {aside && <div className="mt-4 sm:mt-6">{aside}</div>}
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-md p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
