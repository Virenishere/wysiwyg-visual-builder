const { default: Image } = require('next/image');
const { Rnd } = require('react-rnd');

function DraggableCardItem(props) {
  // ... existing code ...

  // Apply border styling and image fit/position without changing drag/resize logic
  const borderStyle = {
    borderWidth: props.item.borderWidth ?? 0,
    borderStyle: props.item.borderStyle ?? 'solid',
    borderColor: props.item.borderColor ?? 'transparent',
    borderRadius: props.item.borderRadius ?? 0,
    overflow: 'hidden',
  };

  const isImage = props.item.type === 'image';
  const objectFit = props.item.objectFit ?? 'cover';
  const objectPosition =
    props.item.objectPosition ??
    `${props.item.objectPositionX ?? 50}% ${props.item.objectPositionY ?? 50}%`;
  const optimizeImage = !!props.item.optimizeImage;

  return (
    <Rnd
      className="card-item"
      // ... existing code ...
    >
      <div
        className="w-full h-full"
        style={borderStyle}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
      >
        {isImage ? (
          <Image
            src={props.item.src ?? props.item.imageUrl}
            alt={props.item.alt ?? props.item.content ?? 'Image'}
            fill
            unoptimized={!optimizeImage}
            style={{
              objectFit,
              objectPosition,
              width: '100%',
              height: '100%',
            }}
            sizes={
              props.item.lockSizing && props.item.width
                ? `${Math.round(props.item.width)}px`
                : '100vw'
            }
            priority={props.item.priority ?? false}
          />
        ) : (
          <div
            style={{
              whiteSpace: props.item.whiteSpace ?? 'normal',
              wordBreak: props.item.wordBreak ?? 'normal',
              letterSpacing: props.item.letterSpacing ?? 0,
              lineHeight: props.item.lineHeight ?? 1.4,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {props.item.content ?? ''}
          </div>
        )}
      </div>
    </Rnd>
  );
}
