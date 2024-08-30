import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
// import './globals.css';
import DodgeGame from './utils/dodge-game';

function App() {
    const [inputData, setInputData] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState('');

    const extractRootDomain = (input) => {
        try {
            let url = input;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            const parsedUrl = new URL(url);
            const hostParts = parsedUrl.hostname.split('.');
            return hostParts.slice(-2).join('.');
        } catch (error) {
            return null;
        }
    };

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleFetchData = async (e) => {
        e.preventDefault();
        const rootDomain = extractRootDomain(inputData);
        if (!rootDomain) {
            setError("Please enter a valid URL");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResponseData('');
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/research`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: rootDomain }),
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            const data = await response.json();
            if (data && data.result) {
                setResponseData(data.result);
            } else {
                throw new Error('Received data is not in the expected format');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const processReferences = (text) => {
        const parts = text.split('References');
        if (parts.length === 2) {
            const [content, references] = parts;
            const linkedReferences = references.replace(
                /(https?:\/\/[^\s]+)/g,
                '[$1]($1)'
            );
            return `${content}References${linkedReferences}`;
        }
        return text;
    };

    const formatMarkdown = (text) => {
        // Replace \n with actual newlines
        return text.replace(/\\n/g, '\n');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-gray-800 bg-opacity-50 p-8 rounded-xl backdrop-filter backdrop-blur-lg">
                <h1 className="text-3xl font-bold mb-4 text-gray-100 text-center">Company Shorts</h1>
                <h2 className="text-xl mb-4 text-gray-300 text-center">Because sometimes what they tell you isn't enough</h2>
                <form onSubmit={handleFetchData} className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-grow">
                            <label htmlFor="url" className="block text-sm font-medium mb-1 text-gray-300">Enter the URL of any company to learn more about it.</label>
                            <input
                                type="url"
                                id="url"
                                value={inputData}
                                onChange={handleInputChange}
                                placeholder="Enter company URL"
                                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full sm:w-auto bg-blue-600 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Fetching...' : 'Fetch Data'}
                        </button>
                    </div>
                </form>
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <DodgeGame />
                    </div>
                )}                

                {responseData && (
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded-md text-gray-100 space-y-4 break-words overflow-hidden">
                        <ReactMarkdown
                            remarkPlugins={[remarkBreaks]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            components={{
                                a: ({node, ...props}) => <a {...props} className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" />
                            }}
                        >
                            {processReferences(formatMarkdown(responseData))}
                        </ReactMarkdown>
                    </div>
                )}
                {error && <p className="text-red-400 text-center">Error: {error}</p>}
            </div>
        </div>
    );
}

export default App;