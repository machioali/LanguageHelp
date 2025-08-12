import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Home, Shield, Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      <div className="max-w-lg w-full mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 border border-red-200 dark:border-red-800">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
              <Lock className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-2">
            🚨 SECURITY ALERT
          </h1>
          
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">
            Unauthorized Access Attempt
          </h2>
          
          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
            <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 mb-3">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">RESTRICTED AREA</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              This admin area is protected by advanced security measures.
              Only authorized personnel with proper credentials are allowed access.
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-8">
            <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-300 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm">SECURITY NOTICE</span>
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              This access attempt has been logged for security purposes.
              Repeated unauthorized attempts may result in restrictions.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Home Page
            </Link>
            
            <Link 
              href="/auth/admin"
              className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Admin Login
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            If you believe this is an error, please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
