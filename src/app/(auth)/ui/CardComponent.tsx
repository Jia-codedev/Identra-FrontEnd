import React from 'react';

const SignInCard = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-signin-frame bg-cover bg-no-repeat bg-center">
      {/* Logo Positioned Above Card */}
      <div className="mb-4">
        <img
          src="/logo1.png" // Replace with your logo path
          alt="Chronologix Logo"
          className="h-12"
        />
      </div>

      {/* Sign-In Card */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-black mb-4">Sign In</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your E-mail"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-purple-600 text-sm font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Sign-In Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Sign in
          </button>

        </form>
      </div>
    </div>
  );
};

export default SignInCard;
