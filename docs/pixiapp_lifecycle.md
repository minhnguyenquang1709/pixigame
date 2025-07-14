```
React is declarative. You describe what the UI should look like based on the current state (<GameUI isPaused={true} />), and React handles the updates.

PixiJS is imperative. You give it step-by-step commands (game.pause(), app.destroy()).
```
**Solution**: allow React component to control PixiJS app lifecycle -> use a centralized game controller (centralize in a custom hook).

**Hook**:
- Encapsulate PixiJS logic (initialization, resizing, pausing, destroying). The React component does not need to know the inner workings of PixiJS, just use what data the hook provides (for UI updates).
- Tie the PixiJS app lifecycle to the React component lifecycle (useEffect).
**Architecture**:
- A React component with a canvas element.
- A custom hook that accepts a canvas ref from the component.
- Initialize: create a PixiJS app (only once with a useEffect hook), add it to the canvas, may load assets.
- Manage Game Logic: instantiate main game class, add it to the Pixi stage.
- Handle Resizing: listen to window resize events, update PixiJS app size.
- **Expose Controls**: return an object with functions that React component can call to control the game (pause, resume, destroy).
- Cleanup: return a cleanup function from the useEffect hook, will be called automatically when the component unmounts.