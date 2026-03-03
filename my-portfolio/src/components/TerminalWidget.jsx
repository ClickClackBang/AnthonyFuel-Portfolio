import { useEffect, useState, useRef } from "react";
import "./TerminalWidget.css";

const LINES = [
  { prompt: "~", cmd: "node --version", output: "v20.11.0" },
  { prompt: "~", cmd: "git status", output: "On branch main\nnothing to commit" },
  { prompt: "~/project", cmd: "npm run dev", output: "> vite\n\nLocal: http://localhost:5173" },
  { prompt: "~/project", cmd: "python3 --version", output: "Python 3.11.4" },
  { prompt: "~/db", cmd: "prisma db push", output: "✓ Generated Prisma Client\n✓ Schema pushed" },
  { prompt: "~/project", cmd: "java --version", output: "openjdk 21.0.1 2023-10-17" },
  { prompt: "~/db", cmd: "psql -U fuel -d portfolio", output: "psql (16.1)\nConnected." },
  { prompt: "~/project", cmd: "curl api.github.com/users/ClickClackBang", output: '{ "public_repos": 12,\n  "followers": 8 }' },
];

const TYPE_SPEED = 38;
const OUTPUT_DELAY = 180;
const NEXT_DELAY = 1800;
const CURSOR_BLINK = 530;

export default function TerminalWidget() {
  const [history, setHistory] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const bodyRef = useRef(null);   // ref on the scrollable body div
  const bottomRef = useRef(null); // ref on the bottom sentinel

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), CURSOR_BLINK);
    return () => clearInterval(id);
  }, []);

  // Typing loop
  useEffect(() => {
    if (currentLine >= LINES.length) {
      const id = setTimeout(() => {
        setHistory([]);
        setCurrentLine(0);
        setTypedCmd("");
        setShowOutput(false);
      }, 2400);
      return () => clearTimeout(id);
    }

    const line = LINES[currentLine];
    let charIndex = 0;
    setTypedCmd("");
    setShowOutput(false);

    const typeInterval = setInterval(() => {
      charIndex++;
      setTypedCmd(line.cmd.slice(0, charIndex));
      if (charIndex === line.cmd.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowOutput(true);
          setTimeout(() => {
            setHistory((prev) => [...prev, { ...line }]);
            setCurrentLine((n) => n + 1);
          }, NEXT_DELAY);
        }, OUTPUT_DELAY);
      }
    }, TYPE_SPEED);

    return () => clearInterval(typeInterval);
  }, [currentLine]);

  // Scroll ONLY the terminal body — never the page
  useEffect(() => {
    const body = bodyRef.current;
    const bottom = bottomRef.current;
    if (!body || !bottom) return;
    // Use scrollTop on the container directly instead of scrollIntoView
    body.scrollTop = body.scrollHeight;
  }, [history, showOutput, typedCmd]);

  const line = LINES[currentLine] || LINES[0];

  return (
    <div className="terminal">
      {/* Title bar */}
      <div className="terminal-bar">
        <span className="terminal-dot dot-red" />
        <span className="terminal-dot dot-yellow" />
        <span className="terminal-dot dot-green" />
        <span className="terminal-title">fuel@portfolio — bash</span>
      </div>

      {/* Body — ref here so we control its scroll directly */}
      <div className="terminal-body" ref={bodyRef}>
        {history.map((h, i) => (
          <div key={i} className="terminal-block">
            <div className="terminal-row">
              <span className="terminal-prompt">{h.prompt} $</span>
              <span className="terminal-cmd">{h.cmd}</span>
            </div>
            <pre className="terminal-output">{h.output}</pre>
          </div>
        ))}

        {currentLine < LINES.length && (
          <div className="terminal-block">
            <div className="terminal-row">
              <span className="terminal-prompt">{line.prompt} $</span>
              <span className="terminal-cmd">{typedCmd}</span>
              <span className={`terminal-cursor ${cursorOn ? "on" : "off"}`}>█</span>
            </div>
            {showOutput && (
              <pre className="terminal-output">{line.output}</pre>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}