import "./App.css";


function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      {/* Navigation Bar */}
      <nav
        style={{
          padding: "10px 0",
          textAlign: "center",
          width: "100%",
          borderBottom: "1px solid #ccc"
        }}
      >
        <b>
          <span style={{ margin: "0 15px" }}>Home</span>
          <span style={{ margin: "0 15px" }}>Skills</span>
          <span style={{ margin: "0 15px" }}>Projects</span>
          <span style={{ margin: "0 15px" }}>Contact</span>
        </b>
      </nav>

      {/* Profile Picture */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#ddd",
            margin: "0 auto"
          }}
        ></div>
        <p style={{ marginTop: "5px" }}>Profile Picture Placeholder</p>
      </div>

      {/* About Me Box */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "20px auto",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          textAlign: "center"
        }}
      >
        <h2 style={{ margin: "10px 0" }}>Anthony Fuel</h2>
        <p style={{ margin: "5px 0" }}>Short summary about background</p>
        <p style={{ margin: "5px 0" }}>Short summary about profession</p>
        <p style={{ margin: "5px 0" }}>Career goal</p>
      </div>

      {/* Resume Button */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button style={{ padding: "10px 20px", fontSize: "15px" }}>
          Download Resume
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "20px",
          padding: "10px",
          textAlign: "center",
          width: "100%",
          borderTop: "1px solid #ccc"
        }}
      >
        <p style={{ margin: "5px 0" }}>Footer</p>
        <b>
          <span style={{ margin: "0 10px" }}>LinkedIn</span>
          <span style={{ margin: "0 10px" }}>GitHub</span>
          <span style={{ margin: "0 10px" }}>Email</span>
        </b>
      </footer>
    </div>
  );
}

export default App;