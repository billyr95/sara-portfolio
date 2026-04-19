import { useCallback, useId } from 'react';
import { set, unset } from 'sanity';
import type { StringInputProps } from 'sanity';

// 9 focal point positions mapped to CSS object-position values
const POSITIONS = [
  { label: 'Top Left',     value: 'top left',     col: 1, row: 1 },
  { label: 'Top Center',   value: 'top center',   col: 2, row: 1 },
  { label: 'Top Right',    value: 'top right',    col: 3, row: 1 },
  { label: 'Left',         value: 'center left',  col: 1, row: 2 },
  { label: 'Center',       value: 'center',       col: 2, row: 2 },
  { label: 'Right',        value: 'center right', col: 3, row: 2 },
  { label: 'Bottom Left',  value: 'bottom left',  col: 1, row: 3 },
  { label: 'Bottom Center',value: 'bottom center',col: 2, row: 3 },
  { label: 'Bottom Right', value: 'bottom right', col: 3, row: 3 },
];

export function FocalPointInput(props: StringInputProps) {
  const { value, onChange } = props;
  const id = useId();

  const handleSelect = useCallback(
    (posValue: string) => {
      onChange(posValue ? set(posValue) : unset());
    },
    [onChange]
  );

  const current = value || 'center';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 40px)',
          gridTemplateRows: 'repeat(3, 40px)',
          gap: '4px',
          width: 'fit-content',
        }}
      >
        {POSITIONS.map((pos) => {
          const isActive = current === pos.value;
          return (
            <button
              key={pos.value}
              type="button"
              title={pos.label}
              onClick={() => handleSelect(pos.value)}
              style={{
                gridColumn: pos.col,
                gridRow: pos.row,
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: isActive ? '2px solid #0062f5' : '2px solid #ddd',
                backgroundColor: isActive ? '#e8f0ff' : '#f4f4f4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#0062f5' : '#bbb',
                }}
              />
            </button>
          );
        })}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: '#666',
          fontFamily: 'sans-serif',
        }}
      >
        Current: <strong>{current}</strong>
      </div>
    </div>
  );
}