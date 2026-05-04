import { useState } from "react";
import { Chat } from "./components/Chat.jsx";
import { Toaster } from "react-hot-toast";

function App() {
    const [username, setUsername] = useState("");
    const [joined, setJoined] = useState(false);

    return (
        <>
            <Toaster position="top-right" />
            <div className="app">
                {!joined ? (
                    <div className="login">
                        <input
                            placeholder="Tu nombre"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button onClick={() => setJoined(true)}>Entrar</button>
                    </div>
                ) : (
                    <Chat username={username} />
                )}
            </div>
        </>
    );
}

export default App;
