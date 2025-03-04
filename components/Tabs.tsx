import React, { useState } from "react";

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(
        tabs && tabs.length > 0 ? tabs[0].id : ""
    );

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="flex border-b border-gray-200">
                {tabs &&
                    tabs.map((tab: Tab) => ( // Tipo Tab agregado aqui
                        <button
                            key={tab.id}
                            className={`flex-1 py-2 text-center text-lg font-medium border-b-2 transition-all duration-300 ${activeTab === tab.id
                                    ? "border-blue-500 text-blue-500"
                                    : "border-transparent text-gray-500 hover:text-blue-500"
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-b-md">
                {tabs &&
                    tabs.map((tab: Tab) => // Tipo Tab agregado aqui
                        activeTab === tab.id && (
                            <div key={tab.id}>{tab.content}</div>
                        )
                    )}
            </div>
        </div>
    );
};

export default Tabs;