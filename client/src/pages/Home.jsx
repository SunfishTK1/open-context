import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mic, HelpCircle } from 'lucide-react';

const Home = () => {
  return (
    <>
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome to OpenContext</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/chat" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600 flex items-center">
            <MessageCircle className="mr-2" />
            Start a New Chat
          </h2>
          <p className="text-gray-600">Explore knowledge with AI-powered conversations.</p>
        </Link>
        <Link to="/lectures" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600 flex items-center">
            <Mic className="mr-2" />
            Record a Lecture
          </h2>
          <p className="text-gray-600">Capture and transcribe your lectures for easy reference.</p>
        </Link>
        <Link to="/lectures" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600 flex items-center">
            <HelpCircle className="mr-2" />
            Generate a Quiz
          </h2>
          <p className="text-gray-600">Create quizzes based on your lecture transcriptions.</p>
        </Link>
      </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#424530" fill-opacity="1" d="M0,192L9.2,176C18.5,160,37,128,55,112C73.8,96,92,96,111,133.3C129.2,171,148,245,166,250.7C184.6,256,203,192,222,154.7C240,117,258,107,277,112C295.4,117,314,139,332,128C350.8,117,369,75,388,74.7C406.2,75,425,117,443,117.3C461.5,117,480,75,498,96C516.9,117,535,203,554,229.3C572.3,256,591,224,609,197.3C627.7,171,646,149,665,144C683.1,139,702,149,720,181.3C738.5,213,757,267,775,261.3C793.8,256,812,192,831,154.7C849.2,117,868,107,886,138.7C904.6,171,923,245,942,234.7C960,224,978,128,997,90.7C1015.4,53,1034,75,1052,90.7C1070.8,107,1089,117,1108,149.3C1126.2,181,1145,235,1163,245.3C1181.5,256,1200,224,1218,224C1236.9,224,1255,256,1274,229.3C1292.3,203,1311,117,1329,96C1347.7,75,1366,117,1385,138.7C1403.1,160,1422,160,1431,160L1440,160L1440,320L1430.8,320C1421.5,320,1403,320,1385,320C1366.2,320,1348,320,1329,320C1310.8,320,1292,320,1274,320C1255.4,320,1237,320,1218,320C1200,320,1182,320,1163,320C1144.6,320,1126,320,1108,320C1089.2,320,1071,320,1052,320C1033.8,320,1015,320,997,320C978.5,320,960,320,942,320C923.1,320,905,320,886,320C867.7,320,849,320,831,320C812.3,320,794,320,775,320C756.9,320,738,320,720,320C701.5,320,683,320,665,320C646.2,320,628,320,609,320C590.8,320,572,320,554,320C535.4,320,517,320,498,320C480,320,462,320,443,320C424.6,320,406,320,388,320C369.2,320,351,320,332,320C313.8,320,295,320,277,320C258.5,320,240,320,222,320C203.1,320,185,320,166,320C147.7,320,129,320,111,320C92.3,320,74,320,55,320C36.9,320,18,320,9,320L0,320Z"></path></svg>

    </>
  );
};

export default Home;