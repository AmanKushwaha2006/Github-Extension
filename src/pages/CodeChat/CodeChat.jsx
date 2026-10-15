import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { analyzeRepository, queryCodebaseAI } from '../../services/githubService';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Compass,
  MessageSquare
} from 'lucide-react';
import './CodeChat.css';

function formatCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export const CodeChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'expressjs/express';

  const [repoData, setRepoData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'How does authentication & security work here?',
    'List all discovered API routes & endpoints',
    'What architectural design patterns are implemented?',
    'What are the key entry points to start reading?'
  ];

  useEffect(() => {
    let isMounted = true;

    async function initChat() {
      let data = null;
      try {
        const cached = sessionStorage.getItem(`analysis_${target}`);
        if (cached) {
          data = JSON.parse(cached);
        } else {
          const res = await analyzeRepository(target);
          data = res.data;
        }
      } catch {
        // Fallback
      }

      if (isMounted) {
        setRepoData(data);
        setMessages([
          {
            sender: 'ai',
            title: `Welcome to CodebaseIQ Assistant for ${target}`,
            content: `Hello! I have indexed the AST architecture, endpoints, and file tree for **${target}**.
You can ask me questions about system flow, middleware routing, database interactions, or where specific logic is located.

Select one of the suggested prompts below or type your question:`,
            timestamp: formatCurrentTime()
          }
        ]);
      }
    }

    initChat();

    return () => {
      isMounted = false;
    };
  }, [target]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      sender: 'user',
      content: query.trim(),
      timestamp: formatCurrentTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await queryCodebaseAI(repoData || { fullName: target }, query);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          title: response.title,
          content: response.content,
          timestamp: formatCurrentTime()
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          title: 'Query Error',
          content: 'Sorry, I encountered an issue analyzing that question against the codebase AST. Please try another query.',
          timestamp: formatCurrentTime()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="codechat-page">
      <div className="codechat-container">
        
        {/* Navigation Bar */}
        <div className="codechat-nav">
          <Link to={`/dashboard?target=${encodeURIComponent(target)}`} className="back-link">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>

          <div className="codechat-nav-actions">
            <Button
              variant="outline"
              size="sm"
              icon={<Compass size={14} />}
              onClick={() => navigate(`/flow?target=${encodeURIComponent(target)}`)}
            >
              Trace Code Flow
            </Button>
          </div>
        </div>

        {/* Chat Box Wrapper */}
        <Card variant="glass" className="chat-window-card">
          
          {/* Header */}
          <div className="chat-window-header">
            <div className="chat-header-identity">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <div className="chat-header-title-row">
                  <h3 className="chat-header-title">CodebaseIQ AI Copilot</h3>
                  <Badge variant="teal" dot>AST Grounded</Badge>
                </div>
                <span className="chat-header-target">Repository: {target}</span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages-container">
            {messages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={index} className={`message-row ${isAi ? 'message-row--ai' : 'message-row--user'}`}>
                  <div className={`message-avatar ${isAi ? 'avatar-ai' : 'avatar-user'}`}>
                    {isAi ? <Bot size={16} /> : <User size={16} />}
                  </div>

                  <div className="message-bubble">
                    <div className="message-header">
                      <span className="message-sender-label">{isAi ? 'CodebaseIQ Assistant' : 'You'}</span>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>

                    {msg.title && <h4 className="message-title">{msg.title}</h4>}

                    <div className="message-content">
                      <pre className="message-text">{msg.content}</pre>
                    </div>

                    {isAi && (
                      <div className="message-footer">
                        <button
                          type="button"
                          className="msg-action-btn"
                          onClick={() => handleCopy(msg.content, index)}
                        >
                          {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="message-row message-row--ai">
                <div className="message-avatar avatar-ai">
                  <Bot size={16} />
                </div>
                <div className="message-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="suggested-prompts-bar">
            <span className="prompts-label">Suggested Queries:</span>
            <div className="prompts-scroll">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  className="prompt-chip"
                  onClick={() => handleSendMessage(q)}
                  disabled={isTyping}
                >
                  <MessageSquare size={12} />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form 
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="chat-text-input"
              placeholder={`Ask anything about ${target} architecture, endpoints, or files...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send size={15} />}
              disabled={!inputValue.trim() || isTyping}
            >
              Send
            </Button>
          </form>

        </Card>

      </div>
    </div>
  );
};

export default CodeChat;
