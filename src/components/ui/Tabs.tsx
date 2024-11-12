import React from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={className} data-active-tab={activeTab}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`flex gap-2 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger: React.FC<TabsTriggerProps & { 
  activeTab?: string; 
  setActiveTab?: (value: string) => void;
}> = ({ 
  value, 
  children, 
  className = '',
  activeTab,
  setActiveTab 
}) => (
  <button
    className={`px-4 py-2 rounded-lg transition-colors ${
      activeTab === value
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    } ${className}`}
    onClick={() => setActiveTab?.(value)}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<TabsContentProps & { 
  activeTab?: string;
}> = ({ 
  value, 
  children,
  activeTab 
}) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};