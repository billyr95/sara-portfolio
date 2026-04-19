import { useCallback, useRef } from 'react';
import { set, unset, useFormValue } from 'sanity';
import type { StringInputProps } from 'sanity';

export function CloudinaryCropInput(props: StringInputProps) {
  const { value, onChange } = props;
  const previewRef = useRef<HTMLDivElement>(null);

  // Read the sibling `thumbnail` field to get the Cloudinary URL
  const thumbnail = useFormValue(['thumbnail']) as any;
  const imageUrl = thumbnail?.secure_url ?? null;

  // Parse current value e.g. "30% 70%" → { x: 30, y: 70 }
  const parsePos = (v: string) => {
    const parts = v?.split(' ');
    if (parts?.length === 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (!isNaN(x) && !isNaN(y)) return { x, y };
    }
    return { x: 50, y: 50 };
  };

  const pos = parsePos(value || '50% 50%');

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      onChange(set(`${x}% ${y}%`));
    },
    [onChange]
  );

  const handleReset = useCallback(() => {
    onChange(set('50% 50%'));
  }, [onChange]);

  if (!imageUrl) {
    return (
      <div style={{ padding: '12px', background: '#f4f4f4', borderRadius: '6px', fontFamily: 'sans-serif', fontSize: '13px', color: '#888' }}>
        Add a Cloudinary thumbnail above to enable crop positioning.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Live preview — click to set position */}
      <div
        ref={previewRef}
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100%',
          height: '260px',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: value || '50% 50%',
          borderRadius: '6px',
          cursor: 'crosshair',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Crosshair showing current focal point */}
        <div
          style={{
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {/* Outer ring */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.5)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
          {/* Centre dot */}
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
        </div>

        {/* Instruction overlay — fades out on hover */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.55)',
          color: 'white',
          fontSize: '11px',
          fontFamily: 'sans-serif',
          padding: '4px 10px',
          borderRadius: '20px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          Click to set focal point
        </div>
      </div>

      {/* Footer: current value + reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#555' }}>
          {value || '50% 50%'}
        </span>
        <button
          type="button"
          onClick={handleReset}
          style={{
            fontFamily: 'sans-serif',
            fontSize: '12px',
            color: '#0062f5',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 0',
          }}
        >
          Reset to center
        </button>
      </div>
    </div>
  );
}