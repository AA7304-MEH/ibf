import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, PlayIcon, BeakerIcon, CodeBracketIcon, CommandLineIcon } from '@heroicons/react/24/solid';
import api from '../../../../services/api';
import confetti from 'canvas-confetti';

const LessonPlayer: React.FC = () => {
    const { moduleId, lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<any>(null);
    const [completed, setCompleted] = useState(false);

    // Code State
    const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n  return "Hello World";\n}');
    const [output, setOutput] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');

    // Interactive/Quiz State
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Project State
    const [repoUrl, setRepoUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await api.get(`/learning/lesson/${moduleId}/${lessonId}`);
                setLesson(res.data);
                setCompleted(res.data.completed || false);
                // Reset states
                setCode(res.data.starterCode || '// Write your solution here\nfunction solution() {\n  return "Hello World";\n}');
                setOutput('');
                setTestStatus('idle');
                setQuizIndex(0);
                setSelectedOption(null);
                setQuizCompleted(false);
                setQuizError(false);
            } catch (error) {
                console.error('Error fetching lesson:', error);
            }
        };
        fetchLesson();
    }, [moduleId, lessonId]);

    const [quizError, setQuizError] = useState(false);

    const handleComplete = async () => {
        try {
            await api.post('/learning/complete', {
                moduleId,
                lessonId,
                xpEarned: lesson.xp || 50
            });
            setCompleted(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error('Error completing lesson:', error);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Running tests...\n');
        setTestStatus('running');

        setTimeout(() => {
            setIsRunning(false);
            try {
                // EXTREMELY SIMPLIFIED/MOCK RUNNER for MVP
                // In a real app, this would use a web worker or backend sandbox
                const userFunc = new Function('return ' + code)();

                if (typeof userFunc !== 'function') {
                    throw new Error('Your code must define a function!');
                }

                let allPassed = true;
                let results = '';

                if (!lesson.testCases || lesson.testCases.length === 0) {
                    results = '✅ No test cases defined. Logic passed!';
                } else {
                    lesson.testCases.forEach((tc: any, i: number) => {
                        try {
                            // Dangerous eval equivalent for input parsing - only for mock demo
                            const input = JSON.parse(tc.input);
                            const result = userFunc(input);
                            const expected = JSON.parse(tc.expected);

                            if (JSON.stringify(result) === JSON.stringify(expected)) {
                                results += `✅ Test Case ${i + 1} Passed\n`;
                            } else {
                                results += `❌ Test Case ${i + 1} Failed: Expected ${tc.expected}, got ${JSON.stringify(result)}\n`;
                                allPassed = false;
                            }
                        } catch (e) {
                            results += `❌ Test Case ${i + 1} Error: ${e.message}\n`;
                            allPassed = false;
                        }
                    });
                }

                setOutput(results + (allPassed ? '\n✨ All Tests Passed!' : '\n⚠️ Some tests failed. Keep trying!'));
                setTestStatus(allPassed ? 'passed' : 'failed');
            } catch (err: any) {
                setOutput(`❌ Runtime Error: ${err.message}`);
                setTestStatus('failed');
            }
        }, 1200);
    };

    const handleQuizSubmit = () => {
        if (selectedOption === null) return;

        const currentQuiz = lesson.quiz[quizIndex];
        const isCorrect = (selectedOption - 1) === currentQuiz.answer;

        if (isCorrect) {
            setQuizError(false);
            if (quizIndex < lesson.quiz.length - 1) {
                setQuizIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setQuizCompleted(true);
            }
        } else {
            setQuizError(true);
        }
    };

    const handleProjectSubmit = () => {
        if (!repoUrl) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            handleComplete();
        }, 2000);
    };

    if (!lesson) return <div className="p-8 text-center text-gray-500">Loading Content...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-900 text-white">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/skillswap/lms')} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg">{lesson.title}</h1>
                        <p className="text-xs text-gray-400">Module {moduleId} • Lesson {lessonId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-amber-500">+{lesson.xp} XP</div>
                    {completed ? (
                        <button disabled className="bg-green-600/20 text-green-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 cursor-default">
                            <CheckCircleIcon className="w-4 h-4" /> Completed
                        </button>
                    ) : (
                        (lesson.type === 'video' || (lesson.type === 'code' && testStatus === 'passed') || (lesson.type === 'interactive' && quizCompleted)) && (
                            <button
                                onClick={handleComplete}
                                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors animate-pulse"
                            >
                                Mark Complete
                            </button>
                        )
                    )}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main View */}
                <div className={`flex-1 overflow-y-auto ${lesson.type === 'code' ? 'w-1/2 border-r border-gray-800' : 'w-full'} bg-gray-950 p-8 flex flex-col items-center`}>

                    {lesson.type === 'video' && (
                        <div className="w-full max-w-5xl space-y-6">
                            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-800 mx-auto">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${lesson.videoId || 'dQw4w9WgXcQ'}`}
                                    title="Video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                <h3 className="font-bold text-xl mb-2">Lesson Notes</h3>
                                <p className="text-gray-400 mb-4">Focus on these core concepts:</p>
                                <ul className="list-disc list-inside text-gray-400 space-y-2">
                                    {(lesson.notes || [
                                        "Mastering the syntax and core concepts",
                                        "Understanding the underlying architecture",
                                        "Best practices for production implementation"
                                    ]).map((note: string, i: number) => (
                                        <li key={i}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {lesson.type === 'code' && (
                        <div className="w-full max-w-3xl">
                            <div className="prose prose-invert mb-8">
                                <h2 className="flex items-center gap-2"><CodeBracketIcon className="w-8 h-8 text-indigo-500" /> Coding Challenge</h2>
                                <p className="text-gray-300 text-lg">{lesson.description || 'Complete the function below to solve the problem.'}</p>
                                <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-indigo-500">
                                    <h4 className="m-0 text-indigo-400">Task:</h4>
                                    <p className="m-0 text-gray-300">Implement the <code>solution</code> function to pass all test cases.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {lesson.type === 'interactive' && (
                        <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
                            <div className="text-center mb-8">
                                <div className="inline-block p-3 rounded-full bg-purple-500/20 text-purple-400 mb-4">
                                    <BeakerIcon className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl font-bold">Interactive Quiz</h2>
                                <p className="text-gray-400">Test your knowledge to complete this lesson.</p>
                            </div>

                            {!quizCompleted ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest font-bold">
                                        <span>Question {quizIndex + 1} of {lesson.quiz.length}</span>
                                    </div>
                                    <h3 className="text-xl font-bold">{lesson.quiz[quizIndex].question}</h3>

                                    <div className="space-y-3">
                                        {lesson.quiz[quizIndex].options.map((opt: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedOption(idx + 1);
                                                    setQuizError(false);
                                                }}
                                                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedOption === (idx + 1)
                                                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                                                    : 'border-gray-700 hover:bg-gray-700 text-gray-300'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>

                                    {quizError && (
                                        <p className="text-red-400 text-sm font-bold flex items-center gap-2 animate-pulse">
                                            <span>❌ Not quite right. Try again!</span>
                                        </p>
                                    )}

                                    <button
                                        disabled={selectedOption === null}
                                        onClick={handleQuizSubmit}
                                        className="w-full py-3 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {quizIndex === lesson.quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">🎉</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
                                    <p className="text-gray-400 mb-6">You've mastered the concepts.</p>
                                    <button onClick={handleComplete} className="px-8 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-500 text-white shadow-lg shadow-green-500/20">
                                        Claim Rewards
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {lesson.type === 'project' && (
                        <div className="w-full max-w-4xl text-left space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                    <CommandLineIcon className="w-10 h-10 text-emerald-500" />
                                    {lesson.title}
                                </h2>
                                <p className="text-xl text-gray-300">{lesson.objective}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <h3 className="font-bold text-lg mb-4 text-white border-b border-gray-700 pb-2">Requirements</h3>
                                    <ul className="space-y-3 text-gray-300">
                                        {['Create a fully responsive layout', 'Use semantic HTML5 tags', 'Implement a mobile-first approach', 'Deploy to Netlify/Vercel'].map((req, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg mb-4 text-white border-b border-gray-700 pb-2">Submission</h3>
                                        <p className="text-gray-400 text-sm mb-4">Submit your GitHub repository URL for automated review.</p>

                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Repository URL</label>
                                        <input
                                            type="text"
                                            value={repoUrl}
                                            onChange={(e) => setRepoUrl(e.target.value)}
                                            placeholder="https://github.com/username/project"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>

                                    <button
                                        onClick={handleProjectSubmit}
                                        disabled={!repoUrl || submitting}
                                        className="w-full mt-6 py-3 bg-emerald-600 rounded-lg font-bold hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Verifying...
                                            </>
                                        ) : (
                                            'Submit Project'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Code Editor (Side Panel for 'code' type) */}
                {lesson.type === 'code' && (
                    <div className="w-1/2 bg-[#1e1e1e] flex flex-col border-l border-gray-800">
                        <div className="h-10 bg-[#252526] flex items-center px-4 justify-between border-b border-gray-800 shrink-0">
                            <span className="text-xs text-gray-400 font-mono">solution.js</span>
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                {testStatus === 'passed' && <><CheckCircleIcon className="w-3 h-3" /> Passed</>}
                            </span>
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-transparent p-4 text-sm font-mono text-gray-300 focus:outline-none resize-none leading-relaxed"
                                spellCheck="false"
                            />
                        </div>

                        {/* Output Console */}
                        <div className="h-1/3 border-t border-gray-800 bg-[#1e1e1e] flex flex-col">
                            <div className="h-8 bg-[#252526] flex items-center px-4 justify-between border-b border-gray-800 shrink-0">
                                <span className="text-xs text-gray-400 font-bold">CONSOLE</span>
                                <button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isRunning ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PlayIcon className="w-3 h-3" />}
                                    Run Code
                                </button>
                            </div>
                            <div className="flex-1 p-4 font-mono text-xs overflow-auto">
                                {output ? (
                                    <pre className={testStatus === 'failed' ? 'text-red-400' : testStatus === 'passed' ? 'text-green-400' : 'text-gray-300'}>
                                        {output}
                                    </pre>
                                ) : (
                                    <span className="text-gray-600 italic">// Output will appear here...</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonPlayer;
