import * as React from 'react';
import '../../styles/animated-flowers.css';

type FlowVariant = 'windFlowStraight' | 'windFlowUp' | 'windFlowDown';

interface FlowerConfig {
  src: string;
  top: string;
  duration: number;
  delay: number;
  blur: number;
  opacity: number;
  size: number;
  variant: FlowVariant;
}

/*
  Coloca tus PNGs en:  public/flowers/flower1.png ... flower5.png
  Cada entrada controla: posición vertical, velocidad, desenfoque (profundidad)
  y trayectoria. Los delays negativos crean el stagger inicial (ya en movimiento al cargar).
*/
const FLOWERS: FlowerConfig[] = [
  { src: '/flowers/flower1.png', top: '7%',  duration: 18, delay: 0,   blur: 5, opacity: 0.30, size: 52,  variant: 'windFlowStraight' },
  { src: '/flowers/flower2.png', top: '21%', duration: 13, delay: -4,  blur: 0, opacity: 0.65, size: 72,  variant: 'windFlowUp'       },
  { src: '/flowers/flower3.png', top: '44%', duration: 22, delay: -8,  blur: 4, opacity: 0.35, size: 48,  variant: 'windFlowDown'     },
  { src: '/flowers/flower1.png', top: '67%', duration: 15, delay: -2,  blur: 0, opacity: 0.60, size: 64,  variant: 'windFlowStraight' },
  { src: '/flowers/flower4.png', top: '14%', duration: 26, delay: -11, blur: 6, opacity: 0.22, size: 38,  variant: 'windFlowUp'       },
  { src: '/flowers/flower5.png', top: '54%', duration: 16, delay: -6,  blur: 0, opacity: 0.55, size: 60,  variant: 'windFlowDown'     },
  { src: '/flowers/flower2.png', top: '80%', duration: 20, delay: -14, blur: 3, opacity: 0.40, size: 46,  variant: 'windFlowStraight' },
  { src: '/flowers/flower3.png', top: '32%', duration: 14, delay: -9,  blur: 0, opacity: 0.50, size: 78,  variant: 'windFlowUp'       },
  { src: '/flowers/flower4.png', top: '88%', duration: 19, delay: -3,  blur: 5, opacity: 0.28, size: 44,  variant: 'windFlowDown'     },
  { src: '/flowers/flower5.png', top: '4%',  duration: 24, delay: -17, blur: 0, opacity: 0.45, size: 56,  variant: 'windFlowStraight' },
  { src: '/flowers/flower1.png', top: '58%', duration: 17, delay: -20, blur: 2, opacity: 0.38, size: 50,  variant: 'windFlowUp'       },
  { src: '/flowers/flower3.png', top: '75%', duration: 21, delay: -7,  blur: 0, opacity: 0.58, size: 68,  variant: 'windFlowDown'     },
];

const AnimatedFlowerBackground: React.FC = () => {
  return (
    <div className="flower-container" aria-hidden="true">
      {FLOWERS.map((flower, i) => (
        <img
          key={i}
          src={flower.src}
          alt=""
          className="flower"
          style={{
            top: flower.top,
            width: flower.size,
            height: flower.size,
            opacity: flower.opacity,
            filter: flower.blur > 0 ? `blur(${flower.blur}px)` : undefined,
            animationName: flower.variant,
            animationDuration: `${flower.duration}s`,
            animationDelay: `${flower.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedFlowerBackground;
