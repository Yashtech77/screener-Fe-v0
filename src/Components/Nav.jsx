// import React from 'react';
// import logobot from '../assets/logobot.png';

// const Nav = () => {
//   return (
//     <nav className="bg-gray-800 px-6 py-3 rounded-2xl shadow-md mx-4 mt-4">
//       <div className="flex items-center justify-between">
//         {/* Logo - Left Corner */}
//         <div className="flex items-center space-x-2">
//           <img
//             src={logobot}
//             alt="Logo"
//             className="w-10 h-10 object-contain"
//           />
//         </div>

//         {/* Title & Tagline - Centered */}
//         <div className="text-center flex-1 -ml-10">
//           <div className="flex justify-center items-center space-x-2">
//             <h1 className="text-white text-2xl font-semibold">Tele-Bot</h1>
//             <span className="text-gray-300 text-sm">Your AI-powered calling assistant</span>
//           </div>
//         </div>

//         {/* Right spacer to keep center alignment balanced */}
//         <div className="w-10 h-10" />
//       </div>
//     </nav>
//   );
// };

// export default Nav;
import React from 'react';
import logobot from '../assets/logobot.png';

const Nav = () => {
  return (
    <nav className="bg-gray-800 px-4 py-3 rounded-2xl shadow-md mx-2 mt-4">
      <div className="flex items-center justify-between">
        {/* Logo - Left Corner */}
        <div className="flex items-center">
          <img
            src={logobot}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Title & Tagline - Centered */}
        <div className="flex-1 text-center -ml-10">
          {/* Mobile: stack | Desktop: row */}
          <div className="flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-2">
            <h1 className="text-white text-lg sm:text-2xl font-semibold">
              Tele-Bot
            </h1>
            <span className="text-gray-300 text-xs sm:text-sm">
              Your AI-powered calling assistant
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="w-10 h-10" />
      </div>
    </nav>
  );
};

export default Nav;
