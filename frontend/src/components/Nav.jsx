import logo from "../assets/imgs/logo.jpeg"

export default function Nav() {
    return (
        <header className="bg-white py-4 border-b border-gray-200">
            <div className="flex justify-center items-center space-x-4">
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-12 w-12 object-contain  " 
                />
            </div>
        </header>
    )
}
