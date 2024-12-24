import './waitingAnimation.css';

export default function WaitingAnimation() {
  return (
    <div className="waitingAnimation">
      {Array.from({ length: 50 }).map((_, index) => (
        <img
          src="圓形logo.png"
          key={index}
          style={{
            left: `${Math.random() * 100}%`, // 隨機水平位置
            animationDelay: `${Math.random() * 2}s`, // 隨機延遲
            transform: `rotate(${Math.random() * 360}deg)`, // 隨機旋轉
          }}
        />
      ))}
    </div>
  );
}
