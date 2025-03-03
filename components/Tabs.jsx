import { useState } from "react";

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex-1 py-2 text-center text-lg font-medium border-b-2 transition-all duration-300 ${activeTab === tab.id ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-b-md">
                {tabs.map((tab) => (
                    activeTab === tab.id && (
                        <div key={tab.id}>{tab.content}</div>
                    )
                ))}
            </div>
        </div>
    );
};

export default Tabs;