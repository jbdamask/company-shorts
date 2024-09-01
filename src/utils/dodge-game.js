import React, { useState, useEffect } from 'react';

const MarioDodgeGame = () => {
  const [marioPosition, setMarioPosition] = useState(100);
  const [turtles, setTurtles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && marioPosition > 0) {
        setMarioPosition(prev => Math.max(0, prev - 10));
      } else if (e.key === 'ArrowRight' && marioPosition < 160) {
        setMarioPosition(prev => Math.min(160, prev + 10));
      }
    };

    const handleTouchStart = (e) => {
      const touchStartX = e.touches[0].clientX;
      const handleTouchMove = (e) => {
        const touchEndX = e.touches[0].clientX;
        if (touchEndX < touchStartX && marioPosition > 0) {
          setMarioPosition(prev => Math.max(0, prev - 10));
        } else if (touchEndX > touchStartX && marioPosition < 160) {
          setMarioPosition(prev => Math.min(160, prev + 10));
        }
        window.removeEventListener('touchmove', handleTouchMove);
      };
      window.addEventListener('touchmove', handleTouchMove);
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart);

    const gameLoop = setInterval(() => {
      if (!gameOver) {
        setScore(prev => prev + 1);
        moveTurtles();
        spawnTurtle();
        checkCollisions();
      }
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      clearInterval(gameLoop);
    };
  }, [gameOver, marioPosition, turtles]);

  const spawnTurtle = () => {
    if (Math.random() < 0.05) {
      setTurtles(prev => [...prev, { x: Math.random() * 160, y: -20 }]);
    }
  };

  const moveTurtles = () => {
    setTurtles(prev => prev.map(turtle => ({ ...turtle, y: turtle.y + 5 })).filter(turtle => turtle.y < 300));
  };

  const checkCollisions = () => {
    turtles.forEach(turtle => {
      if (Math.abs(turtle.x - marioPosition) < 20 && turtle.y > 240) {
        setGameOver(true);
      }
    });
  };

  const resetGame = () => {
    setMarioPosition(100);
    setTurtles([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ width: '200px', height: '300px', backgroundColor: '#87CEEB', position: 'relative', overflow: 'hidden', border: '2px solid black' }}>
      {/* Clouds */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <g transform="translate(10,10)">
          <rect x="0" y="10" width="60" height="20" fill="#FFFFFF"/>
          <rect x="10" y="0" width="40" height="10" fill="#FFFFFF"/>
          <rect x="10" y="30" width="40" height="10" fill="#FFFFFF"/>
        </g>
        <g transform="translate(100,30)">
          <rect x="0" y="10" width="80" height="20" fill="#FFFFFF"/>
          <rect x="10" y="0" width="60" height="10" fill="#FFFFFF"/>
          <rect x="10" y="30" width="60" height="10" fill="#FFFFFF"/>
          <rect x="20" y="40" width="40" height="10" fill="#FFFFFF"/>
        </g>
      </svg>

      {/* Mario */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" style={{ position: 'absolute', bottom: 0, left: marioPosition, width: '40px', height: '40px' }}>
        <rect x="30" y="0" width="30" height="10" fill="#FF0000"/>
        <rect x="20" y="10" width="50" height="10" fill="#FF0000"/>
        <rect x="30" y="20" width="30" height="10" fill="#FFA040"/>
        <rect x="20" y="30" width="50" height="10" fill="#FFA040"/>
        <rect x="20" y="40" width="10" height="10" fill="#FFA040"/>
        <rect x="60" y="40" width="10" height="10" fill="#FFA040"/>
        <rect x="30" y="20" width="10" height="10" fill="#000000"/>
        <rect x="40" y="30" width="10" height="10" fill="#000000"/>
        <rect x="30" y="40" width="30" height="10" fill="#000000"/>
        <rect x="20" y="50" width="50" height="20" fill="#0000FF"/>
        <rect x="30" y="70" width="10" height="10" fill="#0000FF"/>
        <rect x="50" y="70" width="10" height="10" fill="#0000FF"/>
        <rect x="30" y="50" width="10" height="10" fill="#FFFF00"/>
        <rect x="50" y="50" width="10" height="10" fill="#FFFF00"/>
        <rect x="10" y="50" width="10" height="30" fill="#FF0000"/>
        <rect x="70" y="50" width="10" height="30" fill="#FF0000"/>
      </svg>

      {/* Turtles */}
      {turtles.map((turtle, index) => (
        <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" style={{ position: 'absolute', top: turtle.y, left: turtle.x, width: '40px', height: '40px' }}>
          <rect x="20" y="30" width="40" height="40" fill="#00AA00"/>
          <rect x="10" y="40" width="60" height="20" fill="#00AA00"/>
          <rect x="25" y="45" width="5" height="5" fill="#000000"/>
          <rect x="50" y="45" width="5" height="5" fill="#000000"/>
          <rect x="30" y="40" width="20" height="20" fill="#FFFF00"/>
        </svg>
      ))}
      
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>Score: {score}</div>
      
      {gameOver && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '10px' }}>
          <div style={{ color: 'white', fontSize: '24px' }}>Game Over</div>
          <div style={{ color: 'white', fontSize: '18px' }}>Score: {score}</div>
          <button onClick={resetGame} style={{ marginTop: '10px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer' }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MarioDodgeGame;