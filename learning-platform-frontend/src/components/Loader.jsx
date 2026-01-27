import React from 'react';

const Loader = ({ size = 'md', fullScreen = false, text = '', inline = false }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-12 w-12 border-b-2',
        lg: 'h-16 w-16 border-b-2',
        xl: 'h-24 w-24 border-b-2',
    };

    const loader = (
        <div className={`${inline ? 'inline-flex' : 'flex flex-col'} items-center justify-center`}>
            <div
                className={`animate-spin rounded-full border-primary ${sizeClasses[size]}`}
            ></div>
            {text && !inline && (
                <p className="mt-4 text-gray-600 text-center">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-dark">
                <div className="flex flex-col items-center justify-center">
                    <div
                        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
                    ></div>
                    {text && (
                        <p className="mt-4 text-gray-600 text-center">{text}</p>
                    )}
                </div>
            </div>
        );
    }

    return loader;
};

export default Loader;