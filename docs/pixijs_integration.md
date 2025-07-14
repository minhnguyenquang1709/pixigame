1. The Core Problem: Imperative vs. Declarative
```
React is declarative. You describe what the UI should look like based on the current state (<GameUI isPaused={true} />), and React handles the updates.

PixiJS is imperative. You give it step-by-step commands (game.pause(), app.destroy()).
```
The challenge is to bridge this gap, allowing the declarative React world to control the imperative PixiJS world safely and efficiently.
2. The Solution: A Centralized Game Controller

Instead of spreading logic across multiple components and a global event emitter, we can centralize the management of the PixiJS application. The best way to do this in React is with a custom hook (e.g., usePixiGame).

This approach has several advantages:
```
Encapsulation: All the PixiJS logic (initialization, resizing, pausing, destroying) is contained within the hook. The React components don't need to know the inner workings of PixiJS.

Clear Lifecycle Management: The hook will tie the PixiJS app's lifecycle directly to the React component's lifecycle. When the component mounts, the game is created. When it unmounts, the game is destroyed.

Simplified State Management: The hook can expose both the game's state (like score, isPaused) and control functions (like pause, resume) to the React component. This makes it easy to connect UI elements.

Reusability: The hook can be reused for other game screens if needed.
```
3. Architecture Breakdown

Here is the proposed structure:

A. usePixiGame (Custom Hook): The Game Engine Manager

This hook will be the heart of the integration. It will:
```
Accept a canvas ref from the component.

Initialize: In a useEffect hook (that runs only once), it will create the PIXI.Application, add it to the canvas, and load any necessary assets.

Manage Game Logic: It will instantiate your main game class (e.g., GamePlayScreen) and add it to the Pixi stage.

Handle Resizing: It will set up a listener to resize the Pixi canvas whenever the window size changes, ensuring the game is always responsive.

Expose Controls: It will return an object with functions that React components can call, such as pauseGame, resumeGame, and getGameState.

Cleanup: Crucially, it will return a cleanup function from its useEffect hook. This function will be called automatically when the component unmounts, and it will be responsible for destroying the PIXI.Application completely to prevent memory leaks.
```
B. GameContainer (React Component): The Game Screen

This component will be the parent container for your game. It will:
```
Define the layout, including a canvas element and a container for the UI overlay.

Use the usePixiGame hook, passing it the canvas ref.

Manage the game's state (e.g., isPaused, score) using React's useState.

Render the UI overlay (GameUI) and pass it the game state and control functions from the hook.
```
C. GameUI (React Component): The Overlay

This is a simple presentational component. It will:
```
Be positioned absolutely on top of the canvas.

Display the score, pause/resume buttons, and other UI elements.

Call the control functions (pauseGame, resumeGame) passed down from GameContainer when buttons are clicked.
```
4. Data Flow

The data flow will be clear and unidirectional:
```
UI Event: User clicks the "Pause" button in the GameUI component.

React Callback: The button's onClick handler calls the pauseGame function provided by the GameContainer.

Hook Action: The pauseGame function, which comes from the usePixiGame hook, executes the imperative PixiJS logic (e.g., app.ticker.stop(), game.isPaused = true).

State Update: The hook can also update a React state variable (setIsPaused(true)), causing the UI to re-render and show a "Resume" button.
```
This creates a clean, predictable pattern for interaction between your React UI and your PixiJS game.

```typescript
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as PIXI from 'pixi.js';

// --- 1. The PixiJS Game Logic ---
// This class represents your actual game. It's kept separate from React.
class SimpleGame {
    constructor(app) {
        this.app = app;
        this.isRunning = true;
        
        // Create a simple bunny that will spin
        this.bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');
        this.bunny.anchor.set(0.5);
        this.bunny.x = app.screen.width / 2;
        this.bunny.y = app.screen.height / 2;
        
        app.stage.addChild(this.bunny);

        // Add a score text
        this.score = 0;
        this.scoreText = new PIXI.Text(`Score: ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xff1010,
            align: 'center',
        });
        this.scoreText.x = 10;
        this.scoreText.y = 10;
        app.stage.addChild(this.scoreText);

        // Internal game loop logic
        this.app.ticker.add(this.update.bind(this));
    }

    update(ticker) {
        if (this.isRunning) {
            this.bunny.rotation += 0.01 * ticker.delta;
        }
    }

    // Public methods to control the game
    pause() {
        this.isRunning = false;
        this.app.ticker.stop();
    }

    resume() {
        this.isRunning = true;
        this.app.ticker.start();
    }
    
    incrementScore() {
        this.score++;
        this.scoreText.text = `Score: ${this.score}`;
    }

    // Cleanup method
    destroy() {
        console.log("Destroying SimpleGame resources");
        this.app.stage.removeChild(this.bunny);
        this.app.stage.removeChild(this.scoreText);
        this.bunny.destroy();
        this.scoreText.destroy();
        // The ticker is managed by the PIXI.Application, which will be destroyed separately.
    }
}


// --- 2. The Custom Hook: `usePixiGame` ---
// This hook encapsulates all PixiJS-related logic.
const usePixiGame = (canvasRef) => {
    const [gameState, setGameState] = useState({ score: 0, isPaused: false });
    const pixiAppRef = useRef(null);
    const gameRef = useRef(null);

    // Initialization effect - runs only once
    useEffect(() => {
        if (!canvasRef.current || pixiAppRef.current) {
            return;
        }

        console.log("Initializing PixiJS Application");
        const app = new PIXI.Application();
        pixiAppRef.current = app;

        const init = async () => {
            await app.init({
                canvas: canvasRef.current,
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x1099bb,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
            });

            // Instantiate the game logic
            const game = new SimpleGame(app);
            gameRef.current = game;
        };

        init();

        // Handle window resizing
        const handleResize = () => {
            if (pixiAppRef.current) {
                pixiAppRef.current.renderer.resize(window.innerWidth, window.innerHeight);
                if (gameRef.current && gameRef.current.bunny) {
                    // Recenter bunny on resize
                    gameRef.current.bunny.x = window.innerWidth / 2;
                    gameRef.current.bunny.y = window.innerHeight / 2;
                }
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function - this is CRITICAL
        return () => {
            console.log("Cleaning up PixiJS Application");
            window.removeEventListener('resize', handleResize);
            if (gameRef.current) {
                gameRef.current.destroy();
                gameRef.current = null;
            }
            if (pixiAppRef.current) {
                pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
                pixiAppRef.current = null;
            }
        };
    }, [canvasRef]); // Dependency array ensures this runs only when the canvas ref is attached

    // Exposed control functions
    const pauseGame = useCallback(() => {
        if (gameRef.current) {
            gameRef.current.pause();
            setGameState(prev => ({ ...prev, isPaused: true }));
        }
    }, []);

    const resumeGame = useCallback(() => {
        if (gameRef.current) {
            gameRef.current.resume();
            setGameState(prev => ({ ...prev, isPaused: false }));
        }
    }, []);
    
    const increaseScore = useCallback(() => {
        if (gameRef.current) {
            gameRef.current.incrementScore();
            setGameState(prev => ({ ...prev, score: prev.score + 1 }));
        }
    }, []);

    return { gameState, pauseGame, resumeGame, increaseScore };
};


// --- 3. The UI Components ---

// The UI overlay component
const GameUI = ({ score, isPaused, onPause, onResume, onIncreaseScore, onQuit }) => (
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        boxSizing: 'border-box',
        pointerEvents: 'none', // Allow clicks to pass through to the canvas
    }}>
        <div style={{
            alignSelf: 'flex-start',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '24px',
            fontFamily: 'sans-serif'
        }}>
            Score: {score}
        </div>
        <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}> {/* Enable pointer events for buttons */}
            {isPaused ? (
                 <button onClick={onResume} style={buttonStyle}>Resume</button>
            ) : (
                 <button onClick={onPause} style={buttonStyle}>Pause</button>
            )}
            <button onClick={onIncreaseScore} style={buttonStyle}>Add Score</button>
            <button onClick={onQuit} style={{...buttonStyle, background: '#c0392b'}}>Quit Game</button>
        </div>
    </div>
);

// Main Game Screen Component
const GameScreen = ({ onQuit }) => {
    const canvasRef = useRef(null);
    const { gameState, pauseGame, resumeGame, increaseScore } = usePixiGame(canvasRef);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <canvas ref={canvasRef} />
            <GameUI
                score={gameState.score}
                isPaused={gameState.isPaused}
                onPause={pauseGame}
                onResume={resumeGame}
                onIncreaseScore={increaseScore}
                onQuit={onQuit}
            />
        </div>
    );
};

// --- 4. The Main App Component (to simulate screen changes) ---
export default function App() {
    const [showGame, setShowGame] = useState(false);

    if (showGame) {
        // When GameScreen is rendered, the game starts.
        // When we call setShowGame(false), it unmounts, and the cleanup logic runs.
        return <GameScreen onQuit={() => setShowGame(false)} />;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: '#2c3e50', color: 'white' }}>
            <h1>Main Menu</h1>
            <p>Click to start the game.</p>
            <button onClick={() => setShowGame(true)} style={buttonStyle}>
                Start Game
            </button>
        </div>
    );
}

// Simple styling for buttons
const buttonStyle = {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

```