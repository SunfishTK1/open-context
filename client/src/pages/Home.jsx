import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mic, HelpCircle } from 'lucide-react';

const SpiralSVG = () => (
    <svg width="534" height="535" viewBox="0 0 534 535" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M479.52 428.712L476.876 426.69C512.065 380.487 530.671 325.291 530.671 267.047C530.671 176.818 485.276 93.8073 409.235 44.9903L411.04 42.1901C488.046 91.5982 534 175.667 534 267.047C534 326.007 515.145 381.918 479.52 428.712Z" fill="#6B9BA5"/>
    <path d="M267.016 534.031C119.787 534.031 0 414.244 0 267.016C0 119.787 119.787 0 267.016 0V3.32911C121.622 3.32911 3.36026 121.622 3.36026 266.984C3.36026 412.377 121.654 530.64 267.016 530.64C310.948 530.64 354.444 519.625 392.776 498.779L394.363 501.704C355.533 522.892 311.477 534.031 267.016 534.031Z" fill="#6B9BA5"/>
    <path d="M140.664 472.551C68.7298 428.246 25.7932 351.395 25.7932 267.016H32.4826C32.4826 349.062 74.2368 423.765 144.18 466.857L140.664 472.551Z" fill="#6B9BA5"/>
    <path d="M267.016 508.269C240.569 508.269 214.589 504.007 189.761 495.637L191.908 489.321C216.052 497.473 241.316 501.611 267.047 501.611C387.86 501.611 488.201 411.102 500.366 291.066L507.025 291.751C494.455 415.147 391.283 508.269 267.016 508.269Z" fill="#6B9BA5"/>
    <path d="M498.562 229.555C489.819 175.138 461.879 125.263 419.845 89.1402C377.375 52.6131 323.082 32.5137 267.015 32.5137C221.745 32.5137 177.813 45.4258 139.948 69.881C95.8293 98.3809 62.1645 141.317 45.1455 190.788L38.8295 188.61C56.3152 137.739 90.9445 93.5894 136.308 64.2805C175.262 39.1409 220.439 25.8555 266.984 25.8555C324.669 25.8555 380.486 46.5459 424.169 84.0998C467.386 121.249 496.135 172.555 505.127 228.528L498.562 229.555Z" fill="#6B9BA5"/>
    <path d="M267.016 441.25C170.937 441.25 92.7805 363.093 92.7805 267.015C92.7805 228.123 105.319 191.347 128.997 160.669L134.286 164.745C111.511 194.272 99.4699 229.617 99.4699 267.015C99.4699 359.391 174.64 434.561 267.016 434.561C283.413 434.561 299.623 432.196 315.148 427.529L317.077 433.939C300.898 438.824 284.035 441.25 267.016 441.25Z" fill="#6B9BA5"/>
    <path d="M384.686 395.514L380.175 390.598C414.742 358.925 434.561 313.903 434.561 267.047C434.561 234.066 424.978 202.144 406.87 174.733L412.44 171.062C431.294 199.562 441.251 232.76 441.251 267.078C441.22 315.77 420.622 362.596 384.686 395.514Z" fill="#6B9BA5"/>
    <path d="M371.246 135.841C341.346 112.04 305.285 99.4699 267.016 99.4699C233.444 99.4699 201.055 109.364 173.333 128.094L169.599 122.556C198.41 103.079 232.106 92.8116 267.016 92.8116C306.841 92.8116 344.332 105.879 375.415 130.646L371.246 135.841Z" fill="#6B9BA5"/>
    <path d="M267.016 411.319C243.556 411.319 220.252 405.563 199.655 394.674L201.211 391.718C221.341 402.359 244.085 407.99 266.985 407.99C330.238 407.99 386.118 365.458 402.888 304.538L406.093 305.44C388.98 367.792 331.763 411.319 267.016 411.319Z" fill="#6B9BA5"/>
    <path d="M164.994 369.099C137.739 341.843 122.711 305.596 122.711 267.047C122.711 187.49 187.427 122.742 267.015 122.742C346.572 122.742 411.319 187.49 411.319 267.047H407.99C407.99 189.325 344.768 126.103 267.046 126.103C189.325 126.103 126.103 189.325 126.103 267.047C126.103 304.694 140.757 340.101 167.421 366.734L164.994 369.099Z" fill="#6B9BA5"/>
    <path d="M267.015 356.778C217.514 356.778 177.253 316.517 177.253 267.015C177.253 217.514 217.514 177.253 267.015 177.253V183.943C221.216 183.943 183.943 221.216 183.943 267.015C183.943 312.814 221.216 350.088 267.015 350.088C312.814 350.088 350.088 312.814 350.088 267.015H356.778C356.747 316.517 316.486 356.778 267.015 356.778Z" fill="#6B9BA5"/>
    <path d="M267.015 311.632C242.405 311.632 222.399 291.626 222.399 267.015H225.728C225.728 289.759 244.24 308.272 266.984 308.272C289.728 308.272 308.241 289.759 308.241 267.015C308.241 244.272 289.728 225.759 266.984 225.759C254.352 225.759 242.591 231.422 234.689 241.316L232.075 239.231C240.6 228.528 253.326 222.399 266.984 222.399C291.595 222.399 311.601 242.405 311.601 267.015C311.601 291.626 291.595 311.632 267.015 311.632Z" fill="#6B9BA5"/>
    </svg>
    
);

const ZigZagSVG = () => (
    <svg width="186" height="153" viewBox="0 0 186 153" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M160.909 33.2867L157.045 56.1558L134.149 52.4096L130.286 75.2787L107.398 71.5267L103.991 91.6976L83.7953 88.3937L79.9317 111.263L57.0359 107.517L53.1723 130.386L30.2846 126.634L26.4489 149.335L28.9878 149.758L32.3951 129.587L55.2828 133.339L59.1464 110.47L82.0422 114.216L85.9058 91.3471L106.107 94.6591L109.508 74.4801L132.396 78.2321L136.26 55.363L159.156 59.1092L163.019 36.24L183.214 39.5439L183.629 37.0108L160.909 33.2867Z" fill="#0B315E"/>
    <path d="M143.902 9.48882L140.038 32.3579L117.143 28.6118L113.279 51.4809L90.3913 47.7289L87.3288 65.8712L89.437 68.8385L92.5019 50.6822L115.39 54.4342L119.253 31.5651L142.149 35.3113L146.013 12.4422L166.208 15.7461L166.616 13.2048L143.902 9.48882Z" fill="#FF9D00"/>
    </svg>
    
);

const StarSVG = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.4 11.36L8.95 6.90999L13.4 2.46001C13.96 1.90001 13.96 0.98 13.4 0.42C12.84 -0.14 11.92 -0.14 11.36 0.42L6.90999 4.87001L2.45999 0.42C1.89999 -0.14 0.98 -0.14 0.42 0.42C-0.14 0.98 -0.14 1.90001 0.42 2.46001L4.87 6.90999L0.42 11.36C-0.14 11.92 -0.14 12.84 0.42 13.4C0.98 13.96 1.89999 13.96 2.45999 13.4L6.90999 8.95L11.36 13.4C11.92 13.96 12.84 13.96 13.4 13.4C13.97 12.84 13.97 11.93 13.4 11.36Z" fill="#244579"/>
    </svg>
);

const Home = () => {
  return (
    <div className="max-h-90 bg-[#FFF4DD] relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0"><SpiralSVG /></div>
        <div className="absolute bottom-0 right-0"><SpiralSVG /></div>
        <div className="absolute top-1/4 right-1/4"><ZigZagSVG /></div>
        <div className="absolute bottom-1/4 left-1/4"><ZigZagSVG /></div>
        <div className="absolute top-1/3 left-1/3"><StarSVG /></div>
        <div className="absolute bottom-1/3 right-1/3"><StarSVG /></div>
        <div className="absolute top-1/4 left-7/10 right-3/5"><StarSVG /></div>
        <div className="absolute bottom-4/6 right-2/3"><StarSVG /></div>
        <div className="absolute top-1/8 right-1/8"><ZigZagSVG /></div>
        <div className="absolute bottom-1/32 left-64 top-8"><ZigZagSVG /></div>
        <div className="absolute bottom-8 right-12"><ZigZagSVG /></div>
        <div className="absolute top-8 right-12"><ZigZagSVG /></div>
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-[#E0D6BF] bg-opacity-90 p-8 rounded-lg shadow-lg border-8 max-w-4xl w-full border-[#424530]">
          <h1 className="text-4xl font-bold mb-8 text-center text-[#424530]">Welcome to OpenContext</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/chat" className="block p-6 bg-[#EECC91] rounded-lg shadow-md hover:shadow-lg transition-shadow border-4 border-[#424530]">
              <h2 className="text-xl font-semibold mb-2 text-[#424530] flex items-center">
                <MessageCircle className="mr-2" />
                Start a New Chat
              </h2>
              <p className="text-[#424530]">Explore knowledge with AI-powered conversations.</p>
            </Link>
            <Link to="/documents" className="block p-6 bg-[#EECC91] rounded-lg shadow-md hover:shadow-lg transition-shadow border-4 border-[#424530]">
              <h2 className="text-xl font-semibold mb-2 text-[#424530] flex items-center">
                <Mic className="mr-2" />
                Upload Notes & Lectures
              </h2>
              <p className="text-[#424530]">Capture and transcribe your lectures for easy reference.</p>
            </Link>
            <Link to="/quizzes" className="block p-6 bg-[#EECC91] rounded-lg shadow-md hover:shadow-lg transition-shadow border-4 border-[#424530]">
              <h2 className="text-xl font-semibold mb-2 text-[#424530] flex items-center">
                <HelpCircle className="mr-2" />
                Generate a Quiz
              </h2>
              <p className="text-[#424530]">Create quizzes based on your lecture transcriptions.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;