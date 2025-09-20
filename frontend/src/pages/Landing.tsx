import GoaPolice from "../images/GoaPolice";
import { Keyboard } from "lucide-react";

const Landing = () => {
    const handleKeyPress = () => {
        window.location.href = '/registration';
    };

    const handleClick = () => {
        window.location.href = '/registration';
    };

    return(
        <div 
            className="min-h-screen flex flex-col justify-center items-center px-6 py-8"
            onKeyDown={handleKeyPress}
            onClick={handleClick}
            //@ts-ignore
            tabIndex="0">

            <div className="mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-8xl">
                        <GoaPolice/>
                    </span>
                </div>
            </div>

            <h1 className="transition-transform duration-200 hover:-translate-y-2 active:translate-y-2 text-4xl md:text-5xl font-bold text-center mb-4 text-green-800">
                Personnel Deployment Tool
            </h1>

            <p className="transition-transform duration-200 hover:-translate-y-1 active:translate-y-1 text-lg md:text-xl text-yellow-600 font-medium text-center mb-12">
                Goa Police Department
            </p>

            <p className="text-base md:text-lg text-green-700 text-center mb-16 max-w-2xl leading-relaxed">
                Streamlined resource management and personnel allocation system 
                for efficient police operations across Goa.
            </p>

            <div className="text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-green-200 rounded-lg shadow-sm">
                    <div className="w-8 h-8 border-2 border-yellow-500 rounded bg-yellow-50 flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">
                            <Keyboard />
                        </span>
                    </div>
                    <span className="text-green-700 font-medium">Press any key to continue</span>
                </div>
            </div>

            <div className="absolute bottom-6 text-center">
                <p className="text-sm text-green-600">
                    Government of Goa • Police Department
                </p>
            </div>
        </div>
    )
}

export default Landing;