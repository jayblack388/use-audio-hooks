const toTitleCase = (string: string) => {
  const split = string.toLowerCase().split(' ');
  for (let i = 0; i < split.length; i++) {
    split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
  }
  return split.join(' ');
};
const removeSnakeCase = (string: string) => {
  if (string.indexOf('_') > 0) {
    const newString = string.replace(/_/g, ' ');
    const noDoubleSpaces = newString.replace(/\s+/g, ' ').trim();
    return noDoubleSpaces;
  } else {
    return string;
  }
};
export const snakeToTitle = (string: string) => {
  const noCase = removeSnakeCase(string);
  const titleCase = toTitleCase(noCase);
  return titleCase;
};
export const visualization = (
  canvas: HTMLCanvasElement,
  audioCtx: AudioContext,
  audioInput: MediaStreamAudioSourceNode | MediaElementAudioSourceNode,
  {
    enabled,
    lineWidth,
    lineColor,
  }: { enabled: boolean; lineWidth?: number; lineColor?: string },
  player: boolean
) => {
  if (
    !enabled ||
    audioCtx.state === 'closed' ||
    audioInput.context.state === 'closed' ||
    audioInput.context !== audioCtx
  )
    return;
  let context = canvas.getContext('2d');
  if (!context) return;
  let reqId: number;
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  if (player) {
    analyser.connect(audioCtx.destination);
  }
  audioInput.connect(analyser);
  const render = () => {
    if (!context || !(canvas && canvas)) return;
    // get the canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // clear the canvas
    const grad = context.createLinearGradient(0, 100, 200, 100);

    grad.addColorStop(0, 'rgba(99,8,145,1)');
    grad.addColorStop(1, 'rgba(28,5,97,1)');
    context.fillStyle = grad;
    context.fillRect(0, 0, width, height);
    context.lineWidth = lineWidth || 3;
    context.strokeStyle = lineColor || '#E3AE0C';

    context.beginPath();
    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;
    analyser.getByteTimeDomainData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * height) / 2;

      i == 0 ? context.moveTo(x, y) : context.lineTo(x, y);
      x += sliceWidth;
    }

    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();
    reqId = requestAnimationFrame(render);
  };
  // context.scale(window.devicePixelRatio, window.devicePixelRatio);
  render();
  return () => {
    if (!context || !canvas) return;
    const grad = context.createLinearGradient(0, 100, 200, 100);
    grad.addColorStop(0, 'rgba(99,8,145,1)');
    grad.addColorStop(1, 'rgba(28,5,97,1)');
    context.fillStyle = grad;
    context.fillRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(reqId);
  };
};